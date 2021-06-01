import Photo from '@modules/users/contracts/models/photo';

export default interface CounterCollection {
  counterId: string;
  counterTypeLabel: string;
  mechanicalCount: number;
  digitalCount: number;
  userCount?: number;
  telemetryCount: number;
  photos: Photo[];
}
