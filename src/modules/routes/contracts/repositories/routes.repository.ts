import CreateRouteDto from '../dtos/create-route.dto';
import FindRoutesDto from '../dtos/find-routes.dto';
import Route from '../models/route';

export default interface RoutesRepository {
  create(data: CreateRouteDto): Route;
  findOne(data: FindRoutesDto): Promise<Route | undefined>;
  find(data: FindRoutesDto): Promise<Route[]>;
  findAndCount(
    data: FindRoutesDto,
  ): Promise<{
    routes: Route[];
    count: number;
  }>;
  save(data: Route): void;
  delete(route: Route): void;
}
