import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetUserTokenService from './get-user-token.service';

abstract class GetUserTokenController {
  static handle: RequestHandler = async (request, response) => {
    const { userId } = request.params;
    const { userId: adminId } = request;

    const getUserToken = container.resolve(GetUserTokenService);

    const userToken = await getUserToken.execute({
      adminId,
      userId,
    });

    return response.json(userToken);
  };
}

export default GetUserTokenController;
