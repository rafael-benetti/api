import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateRouteDto from '../dtos/create-route-dto';
import Route from '../models/route';

export default interface RoutesRepository {
  create(data: CreateRouteDto): Route;
  find(data: FindEntityDto<Route>): Promise<Route[]>;
  findOne(data: FindEntityDto<Route>): Promise<Route | undefined>;
  findByGroupIds(data: string[]): Promise<Route[]>;
  save(data: Route): void;
}
