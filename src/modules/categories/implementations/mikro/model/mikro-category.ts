import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateCategoryDto from '@modules/categories/contracts/dtos/create-category.dto';
import Box from '@modules/categories/contracts/models/box';
import Category from '@modules/categories/contracts/models/category';
import { v4 } from 'uuid';

@Entity({ collection: 'categories' })
class MikroCategory implements Category {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  label: string;

  @Property()
  boxes: Box[];

  @Property()
  ownerId: string;

  constructor(data?: CreateCategoryDto) {
    if (data) {
      this.id = v4();
      this.label = data.label;
      this.boxes = data.boxes;
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroCategory;
