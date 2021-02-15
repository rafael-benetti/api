import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MachineCollect from './MachineCollect';

@Entity('machine_collecion_counter')
class MachineCollectCounter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number;

  @Column({ name: 'is_digital' })
  isDigital: number;

  @Column({ name: 'is_mechanical' })
  isMechanical: number;

  @Column({ name: 'is_counted' })
  isCounted: number;

  @Column({ name: 'counter_id' })
  counterId: number;

  @Column({ name: 'machine_collect_id' })
  machineCollectId: number;

  @ManyToOne(() => Counter)
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;

  @ManyToOne(() => MachineCollect)
  @JoinColumn({ name: 'machine_collect_id' })
  machineCollect: MachineCollect;
}

export default MachineCollectCounter;
