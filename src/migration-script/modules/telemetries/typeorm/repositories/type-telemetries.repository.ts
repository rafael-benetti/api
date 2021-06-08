// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeTelemetry from '../entities/type-telemetry';

class TypeTelemetriesRepository {
  private ormRepository: Repository<TypeTelemetry>;

  constructor() {
    this.ormRepository = getRepository(TypeTelemetry);
  }

  public async findByOwnerId(ownerId: number): Promise<TypeTelemetry[]> {
    this.ormRepository = getRepository<TypeTelemetry>(TypeTelemetry);

    const telemetries = await this.ormRepository.find({ where: { ownerId } });

    return telemetries;
  }

  public async find(ownerId?: string): Promise<TypeTelemetry[]> {
    if (ownerId) {
      const telemetries = await this.ormRepository.find({
        where: ownerId,
      });
      return telemetries;
    }

    const telemetries = await this.ormRepository.find();
    return telemetries;
  }
}

export default TypeTelemetriesRepository;
