import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateCounterTypeDto from '@modules/counter-types/contracts/dtos/create-counter-types.dto';
import Type from '@modules/counter-types/contracts/enums/type';
import CounterType from '@modules/counter-types/contracts/models/counter-type';
import { v4 } from 'uuid';

@Entity({ collection: 'counter-types' })
class MikroCounterType implements CounterType {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  label: string;

  @Property()
  type: Type;

  @Property()
  ownerId: string;

  constructor(data?: CreateCounterTypeDto) {
    if (data) {
      this.id = v4();
      this.label = data.label;
      this.type = data.type;
      this.ownerId = data.ownerId;
    }
  }
}

export default MikroCounterType;
