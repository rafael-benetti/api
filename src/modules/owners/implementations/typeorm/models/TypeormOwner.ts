import ICreateOwnerDto from '@modules/owners/contracts/dtos/ICreateOwnerDto';
import Owner from '@modules/owners/contracts/models/Owner';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('owners')
class TypeormOwner implements Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  constructor(data?: ICreateOwnerDto) {
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.isActive = data.isActive;
    }
  }
}

export default TypeormOwner;
