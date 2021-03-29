import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateCounterTypeDto from '@modules/counter-types/contracts/dtos/create-counter-types.dto';
import CounterType from '@modules/counter-types/contracts/models/counter-type';
import Type from '@modules/machines/contracts/enums/counter-type';
import { v4 } from 'uuid';

@Entity({ collection: 'counter-type' })
class MikroCounterType implements CounterType {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  label: string;

  @Property()
  type: Type;

  constructor(data?: CreateCounterTypeDto) {
    if (data) {
      this.id = v4();
      this.label = data.label;
      this.type = data.type;
    }
  }
}

export default MikroCounterType;
