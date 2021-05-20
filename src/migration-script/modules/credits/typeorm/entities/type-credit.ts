/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('credit')
class TypeCredit {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'telemetry_id' })
  telemetryId: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @Column({ name: 'selling_point_id' })
  sellingPointId: number;

  @Column({ name: 'money' })
  value: number;

  @Column({ name: 'game_value' })
  gameValue: number;

  @Column()
  date: Date;

  @Column()
  pin: number;

  @Column({ name: 'is_test' })
  isTest: number;
}

export default TypeCredit;
