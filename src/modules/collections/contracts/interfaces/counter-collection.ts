import Photo from '@modules/users/contracts/models/photo';

export default interface CounterCollection {
  counterId: string;
  mechanicalCount: number;
  digitalCount: number;
  operatorCount?: number;
  telemetryCount: number;
  photos: Photo[];
}
