import CreateRouteDto from '@modules/routes/contracts/dtos/create-route.dto';
import FindRoutesDto from '@modules/routes/contracts/dtos/find-routes.dto';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import RouteMapper from '../mapper/route.mapper';
import MikroRoute from '../models/mikro-route';

class MikroRoutesRepository implements RoutesRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroRoute);

  create(data: CreateRouteDto): Route {
    const mikroRoute = new MikroRoute(data);
    this.repository.persist(mikroRoute);
    return RouteMapper.toEntity(mikroRoute);
  }

  async findOne({
    id,
    label,
    machineIds,
  }: FindRoutesDto): Promise<Route | undefined> {
    const route = await this.repository.findOne({
      ...(id && { id }),
      ...(label && { label }),
      ...(machineIds && { machineIds }),
    });

    return route ? RouteMapper.toEntity(route) : undefined;
  }

  async find({
    id,
    groupIds,
    operatorId,
    ownerId,
  }: FindRoutesDto): Promise<Route[]> {
    const routes = await this.repository.find({
      ...(id && { id }),
      ...(operatorId && { operatorId }),
      ...(groupIds && { groupIds }),
      ...(ownerId && { ownerId }),
    });

    return routes.map(route => RouteMapper.toEntity(route));
  }

  save(data: Route): void {
    this.repository.persist(RouteMapper.toMikroEntity(data));
  }
}

export default MikroRoutesRepository;
