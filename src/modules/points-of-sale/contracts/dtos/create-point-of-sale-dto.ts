import Address from '../models/address';

export default interface CreatePointOfSaleDto {
  label: string;

  contactName: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber: string;

  address: Address;

  ownerId: string;

  groupId: string;

  routeId?: string;
}
