import ICreateOwnerDto from '../dtos/ICreateOwnerDto';
import Owner from '../models/Owner';

export default interface IOwnersRepository {
  create(data: ICreateOwnerDto): Owner;
}
