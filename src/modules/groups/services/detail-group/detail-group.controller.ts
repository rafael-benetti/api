import Period from '@modules/machines/contracts/dtos/period.dto';
import { celebrate, Joi } from 'celebrate';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import DetailGroupService from './detail-group.service';

abstract class DetailGroupController {
  static validate = celebrate({
    query: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      period: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { groupId } = req.params;

    const { startDate, endDate, period } = req.query;

    const detailGroupService = container.resolve(DetailGroupService);

    const groupDetail = await detailGroupService.execute({
      userId,
      groupId,
      period: period as Period,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    return res.json(groupDetail);
  }
}

export default DetailGroupController;
