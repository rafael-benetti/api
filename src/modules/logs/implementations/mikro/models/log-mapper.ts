import Log from '@modules/logs/contracts/models/log';
import MikroLog from './mikro-log';

abstract class LogMapper {
  static toEntity(data: MikroLog): Log {
    const log = new Log();
    Object.assign(log, data);
    return log;
  }

  static toMikroEntity(data: Log): MikroLog {
    const log = new MikroLog();
    Object.assign(log, data);
    return log;
  }
}

export default LogMapper;
