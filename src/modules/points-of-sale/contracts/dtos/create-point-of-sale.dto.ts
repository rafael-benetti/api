import Address from '../models/address';

interface CreatePointOfSaleDto {
  ownerId: string;
  groupId: string;
  label: string;
  contactName: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  rent: number;
  isPercentage: boolean;
  address: Address;
}

export default CreatePointOfSaleDto;
