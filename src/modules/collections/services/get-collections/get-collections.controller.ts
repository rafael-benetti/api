import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetCollectionsService from './get-collections.service';

export default abstract class GetCollectionsController {
  static validate = celebrate({
    query: {
      machineSerialNumber: Joi.string(),
      routeId: Joi.string().uuid(),
      operatorId: Joi.string().uuid(),
      limit: Joi.number().integer().min(0),
      offset: Joi.number().integer().min(0),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const {
      machineSerialNumber,
      routeId,
      operatorId,
      limit,
      offset,
    } = request.query as Record<string, never>;

    const getCollections = container.resolve(GetCollectionsService);

    const { collections, count } = await getCollections.execute({
      userId,
      machineSerialNumber,
      operatorId,
      routeId,
      limit,
      offset,
    });

    return response.json({ collections, count });
  };
}
