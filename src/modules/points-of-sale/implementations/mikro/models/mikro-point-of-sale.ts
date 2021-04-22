import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import CreatePointOfSaleDto from '@modules/points-of-sale/contracts/dtos/create-point-of-sale.dto';
import Address from '@modules/points-of-sale/contracts/models/address';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import MikroRoute from '@modules/routes/implementations/mikro/models/mikro-route';
import { OneToMany } from 'typeorm';
import { v4 } from 'uuid';

@Entity({ collection: 'points-of-sale' })
class MikroPointOfSale implements PointOfSale {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  ownerId: string;

  @Property()
  groupId: string;

  @Property()
  routeId?: string;

  @Property()
  label: string;

  @Property()
  contactName: string;

  @Property()
  primaryPhoneNumber: string;

  @Property()
  secondaryPhoneNumber?: string;

  @Property()
  rent: number;

  @Property()
  isPercentage: boolean;

  @Property()
  address: Address;

  constructor(data?: CreatePointOfSaleDto) {
    if (data) {
      this.id = v4();
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.label = data.label;
      this.contactName = data.contactName;
      this.primaryPhoneNumber = data.primaryPhoneNumber;
      this.secondaryPhoneNumber = data.secondaryPhoneNumber;
      this.rent = data.rent;
      this.isPercentage = data.isPercentage;
      this.address = data.address;
    }
  }
}

export default MikroPointOfSale;
