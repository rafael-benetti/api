import Machine from '../infra/typeorm/entities/Machine';

export default interface IFindMachinesResponseDTO {
  machinesCount: number;
  machines: Machine[];
}
