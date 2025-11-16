import { Schema } from 'mongoose';

export interface IFilm {
  owner: Schema.Types.ObjectId;
  title: string;
  year: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  poster: string;
  ratings: { Source: string; Value: string }[];
  imdbID: string;
  createdAt?: Date;
  updatedAt?: Date;
  checkOwner: (userId: string) => boolean;
}
