import Company from '@modules/companies/infra/typeorm/entities/Company';
import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import SellingPoint from '@modules/sellingPoints/infra/typeorm/entities/SellingPoint';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @OneToMany(() => SellingPoint, sellingPoint => sellingPoint.machines)
  @JoinColumn({ name: 'selling_point_id' })
  sellingPoint: SellingPoint;

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

  @ManyToOne(() => Company, company => company.machines)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Counter, counter => counter.machine, {
    cascade: ['insert'],
  })
  counters: Counter[];
}

export default Machine;
