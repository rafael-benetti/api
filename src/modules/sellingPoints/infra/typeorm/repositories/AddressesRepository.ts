import ICreateAddressDTO from '@modules/sellingPoints/dtos/ICreateAddressDTO';
import IAddressesRepository from '@modules/sellingPoints/repositories/IAddressesRepository';
import { getRepository, Repository } from 'typeorm';
import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async create(data: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(data);

    await this.ormRepository.save(address);

    return address;
  }
}

export default AddressesRepository;
