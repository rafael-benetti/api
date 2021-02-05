import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('machines')
class Machine {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ fulltext: true })
  @Column({ name: 'serial_number' })
  serialNumber: string;

  @Column({ nullable: false })
  description: string;

  @Column({ name: 'registration_date', type: 'datetime' })
  registrationDate: Date;

  @Column({ name: 'selling_point_id' })
  sellingPointId: number;

  @Column({
    name: 'game_value',
    nullable: false,
  })
  gameValue: number;

  @Column({
    name: 'last_collection',
    default: () => 'null',
  })
  lastCollection: Date;

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  active: number;

  @Column({ name: 'company_id' })
  companyId: number;

  // @ManyToOne(() => Company, company => company.machines)
  // @JoinColumn({ name: 'company_id' })
  // company: Company;

  @OneToMany(() => Counter, counter => counter.machine)
  counters: Counter[];
}

export default Machine;
