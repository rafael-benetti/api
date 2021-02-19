export default interface ICreateUserDTO {
  ownerId: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  isActive: number;
  roles: string;
  isOperator: number;
  picture: string;
}
