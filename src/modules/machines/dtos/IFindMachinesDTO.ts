export default interface IFindMachinesDTO {
  companyIds: number[];
  machineCategoryId?: number;
  keywords?: string;
  active?: number;
  limit?: number;
  page?: number;
}
