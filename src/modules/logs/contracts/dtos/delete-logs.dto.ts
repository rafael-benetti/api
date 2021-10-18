import LogType from '../enums/log-type.enum';

interface DeleteLogsDto {
  type?: LogType[];
  ownerId?: string;
  startDate: Date;
}

export default DeleteLogsDto;
