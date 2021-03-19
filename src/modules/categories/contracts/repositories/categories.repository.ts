import CreateCategoryDto from '../dtos/create-category.dto';
import FindCategoryDto from '../dtos/find-category.dto';
import Category from '../models/category';

export default interface CategoriesRepository {
  create(data: CreateCategoryDto): Category;
  findOne(data: FindCategoryDto): Promise<Category | undefined>;
  find(data: FindCategoryDto): Promise<Category[]>;
  save(data: Category): void;
}
