import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('counter_groups')
class CounterGroup {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ name: 'machine_id' })
  machineId: number;
}

export default CounterGroup;
