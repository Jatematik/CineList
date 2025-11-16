import { NextFunction, Response, Request } from 'express';
import { Error as MongooseError } from 'mongoose';
import { getFilms } from '../films/films.service';
import Liked from './liked.model';
import ForbiddenError from '../errors/forbidden-error';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

export const addLiked = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const imdbID = req.body.imdbID;
  const ownerId = res.locals.user.id;
  try {
    const film = await getFilms({ i: imdbID });
    const likedFilm = await Liked.create({
      actors: film.Actors,
      country: film.Country,
      director: film.Director,
      genre: film.Genre,
      language: film.Language,
      plot: film.Plot,
      imdbID: film.imdbID,
      poster: film.Poster,
      ratings: film.Ratings.map((item: { Source: string; Value: string }) => ({
        source: item.Source,
        value: item.Value,
      })),
      released: film.Released,
      runtime: film.Runtime,
      title: film.Title,
      writer: film.Writer,
      year: film.Year,
      owner: ownerId,
    });

    res.status(201).send({
      title: likedFilm.title,
    });
  } catch (error) {
    next(error);
  }
};

export const getLikedById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ownerId = res.locals.user.id;

  try {
    const likedList = (await Liked.find({ owner: ownerId })) || [];

    res.send(likedList);
  } catch (error) {
    next(error);
  }
};

export const removeFromLiked = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const ownerId = res.locals.user.id;
  try {
    const likedFilm = await Liked.findById(id).orFail();

    if (!likedFilm.checkOwner(ownerId)) {
      return next(new ForbiddenError('You have no access to this resource'));
    }

    await Liked.findByIdAndDelete({ _id: id });

    res.send({
      id,
    });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Invalid ID'));
    }

    if (error instanceof MongooseError.DocumentNotFoundError) {
      return next(new NotFoundError('Liked film not found'));
    }

    next(error);
  }
};
