import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default SellingPoint;
