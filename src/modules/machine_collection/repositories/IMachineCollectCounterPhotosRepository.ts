import MachineCollectCounterPhoto from '../infra/typeorm/entities/MachineCollectCounterPhotos';

export default interface IMachineCollectCounterPhotosRepository {
  createEntity(photo: string): MachineCollectCounterPhoto;
}
