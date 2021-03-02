interface CreateMachineDto {
  categoryId: string;
  groupId: string;
  pointOfSaleId?: string;
  ownerId: string;
  serialNumber: string;
}

export default CreateMachineDto;
