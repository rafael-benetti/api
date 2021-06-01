import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ResertPasswordService from './reset-password.service';

abstract class ResetPasswordController {
  static handle: RequestHandler = async (req, res) => {
    const { resetPasswordToken } = req.body;

    const resetPassword = container.resolve(ResertPasswordService);

    await resetPassword.execute({
      resetPasswordToken,
    });

    return res.status(204).send();
  };
}

export default ResetPasswordController;
