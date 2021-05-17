import MachineLog from '@modules/machine-logs/contracts/entities/machine-log';
import MikroMachineLog from '../entities/mikro-machine-log';

abstract class MachineLogMapper {
  static toEntity(data: MikroMachineLog): MachineLog {
    const machineLog = new MachineLog();
    Object.assign(machineLog, data);
    return machineLog;
  }

  static toMikroEntity(data: MachineLog): MikroMachineLog {
    const machineLog = new MikroMachineLog();
    Object.assign(machineLog, data);
    return machineLog;
  }
}

export default MachineLogMapper;
