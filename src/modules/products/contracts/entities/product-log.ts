import { v4 } from 'uuid';
import CreateProductLogDto from '../dtos/create-product-log.dto';

export default class ProductLog {
  id: string;

  groupId: string;

  productName: string;

  productType: 'SUPPLY' | 'PRIZE';

  quantity: number;

  logType: 'IN' | 'OUT';

  cost: number;

  createdAt: Date;

  constructor(data?: CreateProductLogDto) {
    if (data) {
      this.id = v4();
      this.groupId = data.groupId;
      this.productName = data.productName;
      this.productType = data.productType;
      this.quantity = data.quantity;
      this.logType = data.logType;
      this.cost = data.cost;
      this.createdAt = new Date();
    }
  }
}
