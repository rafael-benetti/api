/* eslint-disable import/no-extraneous-dependencies */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TypeMachineCollect from './type-machine-collect';
import TypeMachineCollectCounterPhoto from './type-machine-collect-counter-photo';

@Entity('machine_collect_counter')
class TypeMachineCollectCounter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'machine_collect_id' })
  machineCollectId: number;

  @Column({ name: 'counter_id' })
  counterId: number;

  @Column()
  quantity: number;

  @Column({ name: 'is_mechanical', type: 'tinyint' })
  isMechanical: number;

  @Column({ name: 'is_digital', type: 'tinyint' })
  isDigital: number;

  @Column({ name: 'is_counted', type: 'tinyint' })
  isCounted: number;

  @ManyToOne(
    () => TypeMachineCollect,
    machineCollect => machineCollect.counters,
  )
  @JoinColumn({ name: 'machine_collect_id' })
  machineCollect: TypeMachineCollect;

  @OneToMany(
    () => TypeMachineCollectCounterPhoto,
    photo => photo.machineCollectCounter,
    {
      cascade: ['insert', 'update'],
    },
  )
  photos: TypeMachineCollectCounterPhoto[];
}

export default TypeMachineCollectCounter;
