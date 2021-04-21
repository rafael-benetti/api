import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateCollectionService from './create-collection.service';

export default abstract class CreateCollectionController {
  static validate = celebrate({
    body: {
      machineId: Joi.string().uuid().required(),
      observations: Joi.string().required(),
      boxCollections: Joi.array()
        .items(
          Joi.object({
            boxId: Joi.string().uuid().required(),
            counterCollections: Joi.array()
              .items(
                Joi.object({
                  counterId: Joi.string().required(),
                  mechanicalCount: Joi.number().required(),
                  digitalCount: Joi.number().required(),
                  userCount: Joi.number().required(),
                }),
              )
              .required(),
          }),
        )
        .required(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId, files } = request;

    const { machineId, observations, boxCollections } = request.body;

    const createCollection = container.resolve(CreateCollectionService);

    const collection = await createCollection.execute({
      userId,
      machineId,
      observations,
      boxCollections,
      files: files as never,
    });

    return response.status(201).json(collection);
  };
}
