import Machine from '@modules/machines/infra/typeorm/entities/Machine';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MachineCollectCounter from './MachineCollectCounter';

@Entity('machine_collection')
class MachineCollect {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'collection_date' })
  collectionDate: Date;

  @Column()
  active: number;

  @Column({ name: 'previous_collection_id' })
  previousCollectionId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @OneToMany(
    () => MachineCollectCounter,
    machineCollectCounter => machineCollectCounter.machineCollect,
    {
      cascade: ['insert', 'update'],
    },
  )
  machineCollectionCounter: MachineCollectCounter[];
}

export default MachineCollect;
