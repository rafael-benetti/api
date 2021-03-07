import Route from '../models/route';

interface FindRouteDto {
  limit?: number;
  offset?: number;
  filters: Partial<Route>;
  populate?: string[];
}

export default FindRouteDto;
