/* eslint-disable import/no-extraneous-dependencies */
// import Company from '@modules/companies/infra/typeorm/entities/Company';
// import Counter from '@modules/counters/infra/typeorm/entities/Counter';
// import MachineCollect from '@modules/machine_collection/infra/typeorm/entities/MachineCollect';
// import SellingPoint from '@modules/sellingPoints/infra/typeorm/entities/SellingPoint';
// import TypeormNumberTransformer from '@shared/utils/TypeormNumberTransformer';
import TypeCounter from 'migration-script/modules/counters/typeorm/entities/type-counters';
import TypeMachineCategory from 'migration-script/modules/machines-categories/typeorm/entities/type-machine-category';
import TypeSellingPoint from 'migration-script/modules/selling-points/typeorm/entities/type-selling-point';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import MachineCategory from './MachineCategory';

@Entity('machines')
class TypeMachine {
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

  @Column({ name: 'operator_id' })
  operatorId: number;

  @Column({ name: 'telemetry_id' })
  telemetryBoardId: number;

  @ManyToOne(() => TypeSellingPoint, sellingPoint => sellingPoint.machines)
  @JoinColumn({ name: 'selling_point_id' })
  sellingPoint: TypeSellingPoint;

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

  @Column({ name: 'machine_category_id' })
  machineCategoryId: number;

  // @ManyToOne(() => Company, company => company.machines)
  // @JoinColumn({ name: 'company_id' })
  // company: Company;
  //
  @OneToMany(() => TypeCounter, counter => counter.machine, {
    cascade: ['insert', 'update'],
  })
  counters: TypeCounter[];

  @ManyToOne(
    () => TypeMachineCategory,
    machineCategory => machineCategory.machines,
  )
  @JoinColumn({ name: 'machine_category_id' })
  machineCategory: TypeMachineCategory;

  // @OneToMany(() => MachineCollect, machineCollect => machineCollect.machine)
  // machineCollection: MachineCollect[];
}

export default TypeMachine;
