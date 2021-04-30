import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateProductLogDto from '@modules/products/contracts/dtos/create-product-log.dto';
import ProductLog from '@modules/products/contracts/entities/product-log';
import { v4 } from 'uuid';

@Entity({ collection: 'product-logs' })
export default class MikroProductLog implements ProductLog {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property()
  groupId: string;

  @Property()
  productName: string;

  @Property()
  productType: 'SUPPLY' | 'PRIZE';

  @Property()
  quantity: number;

  @Property()
  logType: 'IN' | 'OUT';

  @Property()
  cost: number;

  @Property()
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
