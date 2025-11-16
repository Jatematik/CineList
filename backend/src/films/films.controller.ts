import { NextFunction, Response, Request } from 'express';
import { getFilms } from './films.service';
import BadRequestError from '../errors/bad-request-error';

export const getFilmsByParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const params = req.query as Record<string, string>;

  try {
    const films = await getFilms(params);

    res.send(films);
  } catch (error) {
    next(error);
  }
};

export const getFilmById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params as { id: string };
  try {
    const film = await getFilms({ i: id });

    if (film.Error) {
      throw new BadRequestError(film.Error);
    }

    res.send(film);
  } catch (error) {
    next(error);
  }
};
