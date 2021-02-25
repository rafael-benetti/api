import { Repository, getRepository } from 'typeorm';
import ICreateOwnerDto from '@modules/owners/contracts/dtos/ICreateOwnerDto';
import Owner from '@modules/owners/contracts/models/Owner';
import TypeormProvider from 'providers/orm-provider/implementations/TypeormProvider';
import TypeormOwner from '../models/TypeormOwner';
import IOwnersRepository from '../../../contracts/repositories/IOwnersRepository';

class OwnersRepository implements IOwnersRepository {
  private ormRepository: Repository<TypeormOwner>;

  constructor() {
    this.ormRepository = getRepository(TypeormOwner);
  }

  create(data: ICreateOwnerDto): Owner {
    const owner = new TypeormOwner(data);

    return TypeormProvider.map(owner);
  }
}

export default OwnersRepository;
