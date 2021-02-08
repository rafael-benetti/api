import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateCompanyDTO {
  name: string;
  ownerId: number;
  user: User;
}
