import { Schema, model } from 'mongoose';

interface ILiked {
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

const likedSchema = new Schema(
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

likedSchema.methods.checkOwner = function (userId: string) {
  return this.owner.toString() === userId;
};

const Liked = model<ILiked>('liked', likedSchema);

export default Liked;
