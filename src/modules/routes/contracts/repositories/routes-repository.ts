import CreateRouteDto from '../dtos/create-route-dto';
import FindRouteDto from '../dtos/find-route-dto';
import Route from '../models/route';

export default interface RoutesRepository {
  create(data: CreateRouteDto): Route;
  find(data: FindRouteDto): Promise<Route[]>;
  findOne(data: FindRouteDto): Promise<Route | undefined>;
  save(data: Route): void;
}
