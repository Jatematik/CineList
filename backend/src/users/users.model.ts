import { Schema, model, Model, Types } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import NotAuthorizedError from '../errors/not-authorized-errors';

interface IUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  generateToken: () => string;
}

interface IUserDoc extends Document, IUser {
  _id: Types.ObjectId;
}

interface IUserModel extends Model<IUserDoc> {
  findByCredentials: (
    email: string,
    password: string,
  ) => Promise<IUserDoc | never>;
}

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          return emailRegex.test(value);
        },
        message: 'Email is not valid.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [6, 'The password length cannot be less than 6'],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc: any, ret: { password?: string }) => {
        if (ret.password) {
          delete ret.password;
        }
        return ret;
      },
    },
  },
);

usersSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    },
  );
};

usersSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcryptjs.genSalt(8);

      this.password = await bcryptjs.hash(this.password, salt);
    }
  } catch (error) {
    next(error as Error);
  }
});

usersSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email })
    .select('+password')
    .orFail(
      () => new NotAuthorizedError('User with provided credentials not found'),
    );

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new NotAuthorizedError('Invalid credentials');
  }

  return user;
};

const Users = model<IUser, IUserModel>('users', usersSchema);

export default Users;
