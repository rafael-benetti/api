import Box from '@modules/categories/contracts/models/box';
import Category from '@modules/categories/contracts/models/categoriry';
import Counter from '@modules/categories/contracts/models/counter';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  label: string;
  boxes: Box[];
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ userId, label, boxes }: Request): Promise<Category> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && user.role !== Role.MANAGER)
      throw AppError.authorizationError;

    const checkCategoryExists = await this.categoriesRepository.findOne({
      by: 'label',
      value: label,
    });

    if (checkCategoryExists) throw AppError.labelAlreadyInUsed;

    if (user.role === Role.MANAGER)
      if (!user.permissions?.createCategories)
        throw AppError.authorizationError;

    const createdBoxes = boxes.map(box => {
      const counters = box.counters.map(counter => new Counter(counter));
      return new Box({ counters });
    });

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const category = this.categoriesRepository.create({
      label,
      boxes: createdBoxes,
      ownerId,
    });

    await this.ormProvider.commit();

    return category;
  }
}
export default CreateCategoryService;
