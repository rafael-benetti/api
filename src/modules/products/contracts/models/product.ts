import { v4 } from 'uuid';
import CreateProductDto from '../dtos/create-product.dto';

import ProductType from './product-type';

class Product {
  _id: string;

  label: string;

  quantity: number;

  productType: ProductType;

  constructor(data?: CreateProductDto) {
    if (data) {
      this._id = v4();
      this.label = data.label;
      this.quantity = 0;
      this.productType = data.productType;
    }
  }
}

export default Product;
