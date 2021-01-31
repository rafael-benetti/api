import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column('owner_id')
  ownerId: number;
}

export default Company;
