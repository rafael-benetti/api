import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreatePointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale-dto';
import Address from '@modules/points-of-sale/contracts/models/address';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import uuid from 'uuid';

@Entity()
class MikroPointOfSale implements PointOfSale {
  @PrimaryKey()
  id: string;

  @Property()
  label: string;

  @Property()
  contactName: string;

  @Property()
  primaryPhoneNumber: string;

  @Property()
  secondaryPhoneNumber: string;

  @Property()
  address: Address;

  @Property()
  ownerId: string;

  constructor(data?: CreatePointOfSaleDto) {
    if (data) {
      this.id = uuid.v4();
      this.label = data.label;
      this.primaryPhoneNumber = data.primaryPhoneNumber;
      this.secondaryPhoneNumber = data.secondaryPhoneNumber;
      this.contactName = data.contactName;
      this.address = data.address;
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroPointOfSale;
