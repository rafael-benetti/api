import Counter from '@modules/counters/infra/typeorm/entities/Counter';

export default interface ICreateMachineDTO {
  serialNumber: string;
  description: string;
  registrationDate: string;
  gameValue: number;
  companyId: number;
  sellingPointId: number;
  machineCategoryId: number;
  counters: Counter[];
}
