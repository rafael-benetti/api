import Box from '@modules/machines/contracts/models/box';

export default interface CreateCategoryDto {
  label: string;

  boxes: Box[];

  ownerId: string;
}
