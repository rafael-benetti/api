import CreateProductLogDto from '../dtos/create-product-log.dto';
import FindProductLogsDto from '../dtos/find-product-logs.dto';
import ProductLog from '../entities/product-log';

export default interface ProductLogsRepository {
  create(data: CreateProductLogDto): ProductLog;
  find(data: FindProductLogsDto): Promise<ProductLog[]>;
}
