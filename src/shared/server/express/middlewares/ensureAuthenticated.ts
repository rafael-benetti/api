import AppError from '@shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface JWTTokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw AppError.unknownError;
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as JWTTokenPayload;

    req.userId = sub;

    return next();
  } catch (error) {
    throw AppError.jwtTokenIsMissing;
  }
}
