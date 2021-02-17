import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MachineCollect from './MachineCollect';

@Entity('machine_collect_counter_photos')
class MachineCollectCounterPhoto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  photo: string;

  @Column({ name: 'machine_collect_id' })
  machineCollectId: number;

  @ManyToOne(() => MachineCollect, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ name: 'machine_collect_id' })
  machineCollect: MachineCollect;
}

export default MachineCollectCounterPhoto;
