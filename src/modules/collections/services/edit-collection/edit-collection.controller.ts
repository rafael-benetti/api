import { celebrate, Joi } from 'celebrate';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import EditCollectionService from './edit-collection.service';

export default abstract class EditCollectionController {
  static validate = celebrate({
    body: {
      photosToDelete: Joi.array().items(Joi.string()),
      machineId: Joi.string().uuid().required(),
      observations: Joi.string().required(),
      boxCollections: Joi.array().items(
        Joi.object({
          boxId: Joi.string().uuid().required(),
          counterCollections: Joi.array().items(
            Joi.object({
              counterTypeLabel: Joi.string().required(),
              counterId: Joi.string().required(),
              mechanicalCount: Joi.number(),
              digitalCount: Joi.number(),
              userCount: Joi.number(),
            }),
          ),
        }),
      ),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId, files } = req;
    const {
      machineId,
      observations,
      boxCollections,
      photosToDelete,
    } = req.body;
    const { collectionId } = req.params;

    const editCollectionService = container.resolve(EditCollectionService);

    const collection = await editCollectionService.execute({
      boxCollections,
      collectionId,
      machineId,
      observations,
      files: files as never,
      photosToDelete,
      userId,
    });

    return res.json(collection);
  }
}
