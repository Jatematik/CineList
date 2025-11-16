import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authMiddleware from './middlewares/auth';
import userRouter from './users/users.router';
import { errorHandler } from './middlewares/error-handler';

const { PORT, MONGO_URL } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(userRouter);
app.use(authMiddleware);

app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log('DB is connect');

    app.listen(PORT, () => {
      console.log('Server is running ', PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

run();
