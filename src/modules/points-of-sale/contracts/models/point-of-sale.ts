import { v4 } from 'uuid';
import CreatePointOfSaleDto from '../dtos/create-point-of-sale.dto';
import Address from './address';

class PointOfSale {
  id: string;

  ownerId: string;

  groupId: string;

  routeId?: string;

  label: string;

  contactName: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber?: string;

  rent: number;

  isPercentage: boolean;

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

export default PointOfSale;
