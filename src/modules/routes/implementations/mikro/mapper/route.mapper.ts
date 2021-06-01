import Route from '@modules/routes/contracts/models/route';
import MikroRoute from '../models/mikro-route';

abstract class RouteMapper {
  static toEntity(data: MikroRoute): Route {
    const route = new Route();
    Object.assign(route, data);
    return route;
  }

  static toMikroEntity(data: Route): MikroRoute {
    const route = new MikroRoute();
    Object.assign(route, data);
    return route;
  }
}

export default RouteMapper;
