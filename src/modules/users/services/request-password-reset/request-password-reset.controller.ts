import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import RequestPasswordResetService from './request-password-reset.service';

abstract class RequestPasswordResetController {
  static handle: RequestHandler = async (req, res) => {
    const { email } = req.body;

    const requestPasswordReset = container.resolve(RequestPasswordResetService);

    await requestPasswordReset.execute({
      email,
    });

    return res.status(204).send();
  };
}

export default RequestPasswordResetController;
