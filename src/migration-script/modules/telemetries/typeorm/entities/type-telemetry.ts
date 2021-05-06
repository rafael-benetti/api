/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('telemetry')
class TypeTelemetry {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column()
  iccid?: number;

  @Column({ name: 'last_communication' })
  lastCommunication: Date;

  @Column({ name: 'connection_type' })
  connectionType: string;
}

export default TypeTelemetry;
