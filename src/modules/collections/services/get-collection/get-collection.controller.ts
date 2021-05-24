import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetCollectionService from './get-collection.service';

export default abstract class GetCollectionController {
  static validate = celebrate({
    params: {
      collectionId: Joi.string().uuid(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { collectionId } = request.params;

    const getColletionService = container.resolve(GetCollectionService);

    const collection = await getColletionService.execute({
      collectionId,
      userId,
    });

    return response.json(collection);
  };
}
