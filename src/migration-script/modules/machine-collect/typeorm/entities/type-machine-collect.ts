/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TypeMachineCollectCounter from './type-machine-collect-counter';

@Entity('machine_collect')
class TypeMachineCollect {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @Column({ name: 'collection_date', type: 'datetime' })
  collectionDate: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'previous_collection_id' })
  previousCollectionId: number;

  @OneToMany(() => TypeMachineCollectCounter, counter => counter.machineCollect)
  counters: TypeMachineCollectCounter[];
}

export default TypeMachineCollect;
