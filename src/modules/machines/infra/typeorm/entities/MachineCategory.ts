import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('machines_category')
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

  // @ManyToOne(() => User, user => user.machineCategories)
  // @JoinColumn({ name: 'owner_id' })
  // owner: User;
}

export default MachineCategory;
