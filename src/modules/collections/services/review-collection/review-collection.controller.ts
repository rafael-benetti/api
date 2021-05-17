import { celebrate, Joi } from 'celebrate';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ReviewCollectionService from './review-collection.service';

abstract class ReviewCollectionController {
  static validate = celebrate({
    params: {
      collectionId: Joi.string().required(),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { collectionId } = req.params;

    const reviewCollectionService = container.resolve(ReviewCollectionService);

    await reviewCollectionService.execute({
      collectionId,
      userId,
    });

    return res.json().status(204);
  }
}

export default ReviewCollectionController;
