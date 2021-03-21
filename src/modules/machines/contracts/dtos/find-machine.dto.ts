interface FindMachineDto {
  by: 'id' | 'serialNumber' | 'ownerId' | 'groupId' | 'operatorId';
  value: string | string[];
  populate?: string[];
}

export default FindMachineDto;
