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
    pointsOfSaleId,
  }: FindRoutesDto): Promise<Route | undefined> {
    const route = await this.repository.findOne({
      ...(id && { id }),
      ...(label && { label }),
      ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
    });

    return route ? RouteMapper.toEntity(route) : undefined;
  }

  async find({
    id,
    groupIds,
    operatorId,
    ownerId,
    pointsOfSaleId,
    label,
    offset,
    limit,
  }: FindRoutesDto): Promise<Route[]> {
    const routes = await this.repository.find({
      ...(id && { id }),
      ...(operatorId && { operatorId }),
      ...(groupIds && { groupIds }),
      ...(ownerId && { ownerId }),
      ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
      ...(label && {
        label: new RegExp(label, 'i'),
        offset,
        limit,
      }),
    });

    return routes.map(route => RouteMapper.toEntity(route));
  }

  async findAndCount({
    id,
    groupIds,
    operatorId,
    ownerId,
    pointsOfSaleId,
    label,
    offset,
    limit,
  }: FindRoutesDto): Promise<{ routes: Route[]; count: number }> {
    const [routes, count] = await this.repository.findAndCount(
      {
        ...(id && { id }),
        ...(operatorId && { operatorId }),
        ...(groupIds && { groupIds }),
        ...(ownerId && { ownerId }),
        ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
        ...(label && {
          label: new RegExp(label, 'i'),
        }),
      },
      {
        limit,
        offset,
      },
    );

    return {
      routes: routes.map(route => RouteMapper.toEntity(route)),
      count,
    };
  }

  save(data: Route): void {
    const reference = this.repository.getReference(data.id);
    const route = this.repository.assign(reference, data);
    this.repository.persist(route);
  }

  delete(data: Route): void {
    const reference = this.repository.getReference(data.id);
    const route = this.repository.assign(reference, data);
    this.repository.remove(route);
  }
}

export default MikroRoutesRepository;
