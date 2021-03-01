import uuid from 'uuid';
import CreatePointOfSaleDto from '../dtos/create-point-of-sale-dto';
import Address from './address';

class PointOfSale {
  id: string;

  label: string;

  contactName: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber: string;

  address: Address;

  ownerId: string;

  constructor(data?: CreatePointOfSaleDto) {
    if (data) {
      this.id = uuid.v4();
      this.label = data.label;
      this.contactName = data.contactName;
      this.primaryPhoneNumber = data.primaryPhoneNumber;
      this.secondaryPhoneNumber = data.secondaryPhoneNumber;
      this.address = data.address;
      this.ownerId = data.ownerId;
    }
  }
}

export default PointOfSale;
