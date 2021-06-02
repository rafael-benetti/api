/* eslint-disable import/no-extraneous-dependencies */
import TypeMachine from 'migration-script/modules/machines/typeorm/entities/type-machine';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('counter')
class TypeCounter {
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

  @Column({
    name: 'pulse_value',
  })
  pulseValue: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @Column({ name: 'type_id' })
  typeId: number;

  @ManyToOne(() => TypeMachine, machine => machine.counters, {
    cascade: ['insert', 'update', 'remove'],
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'machine_id' })
  machine: TypeMachine;

  @Column({ name: 'counter_group_id' })
  counterGroupId: number;
}

export default TypeCounter;
