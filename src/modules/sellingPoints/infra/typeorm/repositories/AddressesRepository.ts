import ICreateAddressDTO from '@modules/sellingPoints/dtos/ICreateAddressDTO';
import IAddressesRepository from '@modules/sellingPoints/repositories/IAddressesRepository';
import { getRepository, Repository } from 'typeorm';
import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  create(data: ICreateAddressDTO): Address {
    const address = this.ormRepository.create(data);
    return address;
  }
}

export default AddressesRepository;
