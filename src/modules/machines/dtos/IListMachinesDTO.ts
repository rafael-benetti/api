export default interface IListMachinesDTO {
  companyIds: number[];
  name?: string;
  active?: number;
  limit: number;
  page: number;
}
