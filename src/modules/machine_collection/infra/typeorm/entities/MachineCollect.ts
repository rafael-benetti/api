import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(
    () => MachineCollectCounter,
    machineCollectCounter => machineCollectCounter.machineCollect,
  )
  machineCollectionCounter: MachineCollectCounter[];
}

export default MachineCollect;
