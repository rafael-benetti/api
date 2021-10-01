import LogType from '../enums/log-type.enum';

class Log {
  id: string;

  createdBy: string;

  ownerId: string;

  groupId?: string;

  type: LogType;

  quantity?: number;

  destinationId?: string;

  machineId?: string;

  affectedGroupId?: string;

  posId?: string;

  routeId?: string;

  userId?: string;

  collectionId?: string;

  productName?: string;

  createdAt: Date;
}

export default Log;
