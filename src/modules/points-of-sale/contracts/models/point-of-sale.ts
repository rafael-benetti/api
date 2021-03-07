import Address from './address';

class PointOfSale {
  _id: string;

  label: string;

  contactName: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber: string;

  address: Address;

  groupId: string;

  routeId: string;

  ownerId: string;
}

export default PointOfSale;
