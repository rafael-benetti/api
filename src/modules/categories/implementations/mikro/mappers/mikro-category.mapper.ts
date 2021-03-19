import Category from '@modules/categories/contracts/models/categoriry';
import MikroCategory from '../model/mikro-category';

abstract class CategoryMapper {
  static toEntity(data: MikroCategory): Category {
    const pointOfSale = new Category();
    Object.assign(pointOfSale, data);
    return pointOfSale;
  }

  static toMikroEntity(data: Category): MikroCategory {
    const pointOfSale = new MikroCategory();
    Object.assign(pointOfSale, data);
    return pointOfSale;
  }
}

export default CategoryMapper;
