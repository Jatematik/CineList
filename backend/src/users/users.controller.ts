import { NextFunction, Response, Request } from 'express';
import { Error as MongooseError } from 'mongoose';
import Users from './users.model';
import { transformError } from '../helpers/transform-error';
import Conflict from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import { ErrorCodes } from '../constants/error-codes';

const ONE_HOUR = 3600000;

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.body;

  try {
    const newUser = await Users.create(user);
    const token = newUser.generateToken();

    res
      .status(201)
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ONE_HOUR,
      })
      .send(newUser);
  } catch (error) {
    if ((error as Error).message.startsWith(ErrorCodes.unique)) {
      return next(new Conflict('User with this email already exists'));
    }

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findByCredentials(email, password);
    const token = user.generateToken();

    res
      .status(201)
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ONE_HOUR,
      })
      .send({ id: user._id });
  } catch (error) {
    next(error);
  }
};
