import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetCollectionsService from './get-collections.service';

export default abstract class GetCollectionsController {
  static validate = celebrate({
    query: {
      machineId: Joi.string().uuid(),
      limit: Joi.number().integer().min(0),
      offset: Joi.number().integer().min(0),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { machineId, limit, offset } = request.query as Record<string, never>;

    const getCollections = container.resolve(GetCollectionsService);

    const collections = await getCollections.execute({
      userId,
      machineId,
      limit,
      offset,
    });

    return response.json(collections);
  };
}
