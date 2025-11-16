import { Schema, model } from 'mongoose';
import { IFilm } from '../types';

const wishlistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    title: String,
    year: String,
    released: String,
    runtime: String,
    genre: String,
    director: String,
    writer: String,
    actors: String,
    plot: String,
    language: String,
    country: String,
    poster: String,
    ratings: [
      {
        source: String,
        value: String,
      },
    ],
    imdbID: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

wishlistSchema.methods.checkOwner = function (userId: string) {
  return this.owner.toString() === userId;
};

const Wishlist = model<IFilm>('wishlist', wishlistSchema);

export default Wishlist;
