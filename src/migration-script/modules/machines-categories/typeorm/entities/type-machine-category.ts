/* eslint-disable import/no-extraneous-dependencies */
import TypeMachine from 'migration-script/modules/machines/typeorm/entities/type-machine';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import Machine from './Machine';

@Entity('machine_category')
class TypeMachineCategory {
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

  @OneToMany(() => TypeMachine, machine => machine.machineCategory)
  machines: TypeMachine[];
}

export default TypeMachineCategory;
