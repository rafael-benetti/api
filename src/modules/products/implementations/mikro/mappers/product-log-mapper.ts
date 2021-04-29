import ProductLog from '@modules/products/contracts/entities/product-log';
import MikroProductLog from '../entities/mikro-product-log';

abstract class ProductLogMapper {
  static map(data: MikroProductLog): ProductLog;

  static map(data: ProductLog): MikroProductLog;

  static map(data: unknown): unknown {
    const productLog =
      data instanceof ProductLog ? new MikroProductLog() : new ProductLog();

    Object.assign(productLog, data);

    return productLog;
  }
}

export default ProductLogMapper;
