import Box from '../models/box';

export default interface CreateCategoryDto {
  label: string;

  boxes: Box[];

  ownerId: string;
}
