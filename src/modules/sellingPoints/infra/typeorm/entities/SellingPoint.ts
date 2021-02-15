import Machine from '@modules/machines/infra/typeorm/entities/Machine';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './Address';

@Entity('selling_points')
class SellingPoint {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'address_id' })
  addressId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column()
  name: string;

  @Column()
  responsible: string;

  @Column()
  phone1: string;

  @Column()
  phone2: string;

  @OneToMany(() => Machine, machine => machine.sellingPoint)
  machines: Machine[];

  @OneToOne(() => Address, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}

export default SellingPoint;
