import Address from './address';

class PointOfSale {
  id: string;

  label: string;

  contactName: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber: string;

  address: Address;

  groupId: string;

  ownerId: string;
}

export default PointOfSale;
