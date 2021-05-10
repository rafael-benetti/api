import Type from '../enums/type';

export default interface CreateCounterTypeDto {
  label: string;
  type: Type;
  ownerId: string;
}
