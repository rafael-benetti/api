import CreateCategoryDto from '@modules/categories/contracts/dtos/create-category.dto';
import FindCategoryDto from '@modules/categories/contracts/dtos/find-category.dto';
import Category from '@modules/categories/contracts/models/category';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import CategoryMapper from '../mappers/mikro-category.mapper';
import MikroCategory from '../model/mikro-category';

class MikroCategoriesRepository implements CategoriesRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroCategory);

  create(data: CreateCategoryDto): Category {
    const mikroCategory = new MikroCategory(data);
    this.repository.persist(mikroCategory);
    return CategoryMapper.toEntity(mikroCategory);
  }

  async findOne(data: FindCategoryDto): Promise<Category | undefined> {
    const category = await this.repository.findOne({
      [data.by]: data.value,
    });

    return category ? CategoryMapper.toEntity(category) : undefined;
  }

  async find(data: FindCategoryDto): Promise<Category[]> {
    const categories = await this.repository.find({
      [data.by]: data.value,
    });

    return categories.map(category => CategoryMapper.toEntity(category));
  }

  save(data: Category): void {
    this.repository.persist(CategoryMapper.toMikroEntity(data));
  }
}

export default MikroCategoriesRepository;
