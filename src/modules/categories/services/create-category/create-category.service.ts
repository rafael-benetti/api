import Category from '@modules/categories/contracts/models/category';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Box from '@modules/machines/contracts/models/box';
import Counter from '@modules/machines/contracts/models/counter';
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

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

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

    const boxesEntities = boxes.map(box => {
      const counters = box.counters.map(counter => new Counter(counter));
      return new Box({ counters });
    });

    const counterTypeIds = [
      ...new Set(
        boxesEntities.flatMap(boxe =>
          boxe.counters.map(counter => counter.counterTypeId),
        ),
      ),
    ];

    const counterTypes = await this.counterTypesRepository.find({
      id: counterTypeIds,
    });

    if (counterTypeIds.length !== counterTypes.length)
      throw AppError.authorizationError;

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const category = this.categoriesRepository.create({
      label,
      boxes: boxesEntities,
      ownerId,
    });

    await this.ormProvider.commit();

    return category;
  }
}
export default CreateCategoryService;
