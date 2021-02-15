import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Machine from './Machine';

@Entity('machine_categories')
class MachineCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'gift_spaces' })
  giftSpaces: number;

  @Column()
  active: number;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @OneToMany(() => Machine, machine => machine.machineCategory)
  machines: Machine[];

  // @ManyToOne(() => User, user => user.machineCategories)
  // @JoinColumn({ name: 'owner_id' })
  // owner: User;
}

export default MachineCategory;
