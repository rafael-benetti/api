import Address from '../infra/typeorm/entities/Address';

export default interface ICreateSellingPointDTO {
  name: string;
  companyId: number;
  responsible: string;
  phone1: string;
  phone2: string;
  address: Address;
}
