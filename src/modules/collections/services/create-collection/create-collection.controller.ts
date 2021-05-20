import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateCollectionService from './create-collection.service';

export default abstract class CreateCollectionController {
  static validate = celebrate({
    body: {
      machineId: Joi.string().uuid().required(),
      observations: Joi.string().required(),
      startTime: Joi.date(),
      startLocation: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
      endLocation: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
      boxCollections: Joi.array()
        .items(
          Joi.object({
            boxId: Joi.string().uuid().required(),
            prizeCount: Joi.number(),
            counterCollections: Joi.array()
              .items(
                Joi.object({
                  counterId: Joi.string().required(),
                  counterTypeLabel: Joi.string().required(),
                  mechanicalCount: Joi.number(),
                  digitalCount: Joi.number(),
                  userCount: Joi.number(),
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

    const {
      machineId,
      observations,
      boxCollections,
      startTime,
      startLocation,
      endLocation,
    } = request.body;

    const createCollection = container.resolve(CreateCollectionService);

    const collection = await createCollection.execute({
      userId,
      machineId,
      observations,
      boxCollections,
      files: files as never,
      startTime,
      endLocation,
      startLocation,
    });

    return response.status(201).json(collection);
  };
}
