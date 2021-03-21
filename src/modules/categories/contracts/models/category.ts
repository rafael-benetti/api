import Box from '@modules/machines/contracts/models/box';

class Category {
  id: string;

  label: string;

  boxes: Box[];

  ownerId: string;
}

export default Category;
