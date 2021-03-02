import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateMachineCategoryDto from '@modules/machine-categories/contracts/dtos/create-machine-category-dto';
import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import { v4 } from 'uuid';

@Entity({ tableName: 'machine_categories' })
class MikroMachineCategory implements MachineCategory {
  @PrimaryKey()
  _id: string;

  @Property()
  label: string;

  @Property()
  ownerId: string;

  constructor(data?: CreateMachineCategoryDto) {
    if (data) {
      this._id = v4();
      this.label = data.label;
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroMachineCategory;
