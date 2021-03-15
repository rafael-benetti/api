import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

export default async function authHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw AppError.tokenIsMissing;
  }

  const sessionProvider = container.resolve<SessionProvider>('SessionProvider');

  const [, token] = authHeader.split(' ');

  const userId = await sessionProvider.getTokenOwner(token);

  if (!userId) throw AppError.invalidToken;

  req.userId = userId;

  return next();
}
