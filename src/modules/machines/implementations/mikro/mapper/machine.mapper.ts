import Machine from '@modules/machines/contracts/models/machine';
import MikroMachine from '../models/mikro-machine';

abstract class MachineMapper {
  static toEntity(data: MikroMachine): Machine {
    const machine = new Machine();
    Object.assign(machine, data);
    return machine;
  }

  static toMikroEntity(data: Machine): MikroMachine {
    const machine = new MikroMachine();
    Object.assign(machine, data);
    return machine;
  }
}

export default MachineMapper;
