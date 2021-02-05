import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column()
  street: string;

  @Column()
  number: number;

  @Column()
  note: string;
}

export default Address;
