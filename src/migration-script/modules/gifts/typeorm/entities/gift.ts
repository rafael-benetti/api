/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gift')
class TypeGift {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'telemetry_id' })
  telemetryId: number;

  @Column({ name: 'machine_id' })
  machineId: number;

  @Column({ name: 'selling_point_id' })
  sellingPointId: number;

  @Column({ name: 'quantity' })
  value: number;

  @Column()
  date: Date;

  @Column()
  pin: number;
}

export default TypeGift;
