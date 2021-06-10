/* eslint-disable import/no-extraneous-dependencies */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TypeMachineCollectCounter from './type-machine-collect-counter';

@Entity('machine_collect_counter_photo')
class TypeMachineCollectCounterPhoto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'machine_collect_counter_id' })
  machineCollectCounterId: number;

  @Column({ name: 'photo' })
  photo: string;

  @Column({ name: 'counter_id' })
  counterId: number;

  @Column({ name: 'machine_collect_id' })
  machineCollectId: number;

  @ManyToOne(
    () => TypeMachineCollectCounter,
    machineCollectCounter => machineCollectCounter.photos,
  )
  @JoinColumn({ name: 'machine_collect_counter_id' })
  machineCollectCounter: TypeMachineCollectCounter;
}

export default TypeMachineCollectCounterPhoto;
