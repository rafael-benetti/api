import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import Box from './box';

class Machine {
  id: string;

  categoryId?: string;

  categoryLabel: string;

  telemetryBoardId?: number;

  telemetryBoard?: TelemetryBoard;

  groupId: string;

  boxes: Box[];

  serialNumber: string;

  gameValue: number;

  operatorId?: string;

  locationId?: string;

  pointOfSale?: PointOfSale;

  typeOfPrize?: { id: string; label: string };

  minimumPrizeCount?: number;

  ownerId: string;

  isActive: boolean;

  maintenance: boolean;

  lastConnection?: Date;

  lastCollection?: Date;

  incomePerPrizeGoal?: number;

  incomePerMonthGoal?: number;
}

export default Machine;
