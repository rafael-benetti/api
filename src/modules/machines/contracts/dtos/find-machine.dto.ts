interface FindMachineDto {
  by:
    | 'id'
    | 'serialNumber'
    | 'ownerId'
    | 'groupId'
    | 'operatorId'
    | 'telemetryBoardId';
  value: string | string[] | number;
  populate?: string[];
  ownerId?: string;
}

export default FindMachineDto;
