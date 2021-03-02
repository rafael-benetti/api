interface FindMachineDto {
  by: '_id' | 'serialNumber';
  value: string;
}

export default FindMachineDto;
