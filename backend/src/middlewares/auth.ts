import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import NotAuthorizedError from '../errors/not-authorized-errors';

export default (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new NotAuthorizedError());
  }

  const tokenSecret = process.env.JWT_SECRET as string;

  try {
    const payload = jwt.verify(accessToken, tokenSecret) as { id: string };
    res.locals.user = payload;
    next();
  } catch {
    next(new NotAuthorizedError());
  }
};
