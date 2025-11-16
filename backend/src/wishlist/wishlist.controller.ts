import { NextFunction, Response, Request } from 'express';
import { Error as MongooseError } from 'mongoose';
import { getFilms } from '../films/films.service';
import Wishlist from './wishlist.model';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const createWishlistFilm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const imdbID = req.body.imdbID;
  const ownerId = res.locals.user.id;

  try {
    const film = await getFilms({ i: imdbID });
    const wishlistFilm = await Wishlist.create({
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
      title: wishlistFilm.title,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlistById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ownerId = res.locals.user.id;

  try {
    const wishlistList = (await Wishlist.find({ owner: ownerId })) || [];

    res.send(wishlistList);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const ownerId = res.locals.user.id;
  try {
    const wishlistFilm = await Wishlist.findById(id).orFail();

    if (!wishlistFilm.checkOwner(ownerId)) {
      return next(new ForbiddenError('You have no access to this resource'));
    }

    await Wishlist.findByIdAndDelete({ _id: id });

    res.send({
      id,
    });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Invalid ID'));
    }

    if (error instanceof MongooseError.DocumentNotFoundError) {
      return next(new NotFoundError('wishlist film not found'));
    }

    next(error);
  }
};
