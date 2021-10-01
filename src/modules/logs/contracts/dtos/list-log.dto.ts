import LogType from '../enums/log-type.enum';

interface FindAndCountLogsDto {
  filters: {
    type?: LogType[];
    ownerId?: string;
    startDate?: Date;
    endDate?: Date;
  };
  limit: number;
  offset: number;
}

export default FindAndCountLogsDto;
