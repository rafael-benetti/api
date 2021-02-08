import Machine from '@modules/machines/infra/typeorm/entities/Machine';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('counters')
class Counter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slot: number;

  @Column({ name: 'has_digital', nullable: false })
  hasDigital: number;

  @Column({ name: 'has_mechanical', nullable: false })
  hasMechanical: number;

  @Column()
  pin: number;

  @Column({ name: 'pulse_value' })
  pulseValue: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @Column({ name: 'type_id' })
  typeId: number;

  @ManyToOne(() => Machine, machine => machine.counters, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;
}

export default Counter;
