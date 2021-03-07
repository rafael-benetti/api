import createRouteDto from '@modules/routes/contracts/dtos/create-route-dto';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import { container } from 'tsyringe';
import MikroRoute from '../../models/mikro-route';

class MikroRoutesRepository implements RoutesRepository {
  private entityManeger = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroRoute);

  create(data: createRouteDto): Route {
    const route = new MikroRoute(data);
    this.entityManeger.persist(route);

    return MikroMapper.map(route);
  }

  async find({
    filters,
    limit,
    offset,
    populate,
  }: FindEntityDto<Route>): Promise<Route[]> {
    const mikroRoutes = await this.entityManeger.find(
      {
        ...filters,
      },
      {
        limit,
        offset,
        populate,
      },
    );

    return mikroRoutes.map(mikroRoute => MikroMapper.map(mikroRoute));
  }

  async findOne({ filters }: FindEntityDto<Route>): Promise<Route | undefined> {
    const route = await this.entityManeger.findOne({ ...filters });

    return route ? MikroMapper.map(route) : undefined;
  }

  save(data: Route): void {
    this.entityManeger.persist(MikroMapper.map(data));
  }
}

export default MikroRoutesRepository;
