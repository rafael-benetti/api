import Category from '@modules/categories/contracts/models/category';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute(userId: string): Promise<Category[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const categories = await this.categoriesRepository.find({
      by: 'ownerId',
      value: user.ownerId ? user.ownerId : user.id,
    });

    return categories;
  }
}
export default ListCategoriesService;
