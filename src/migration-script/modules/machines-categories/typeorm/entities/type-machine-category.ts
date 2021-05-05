/* eslint-disable import/no-extraneous-dependencies */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import Machine from './Machine';

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

  // @OneToMany(() => TypeMachine, machine => machine.machineCategory)
  // machines: TypeMachine[];
}

export default MachineCategory;
