import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail";
import CATEGORIES from "../categories/categories";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;

  boj: {
    userId: string;
    levels: number[];
  };
  cf: {
    userId: string;
    levels: number[];
  };

  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const isValidUsername = (s: string) => {
  // \w: letters, numbers, and underscores ("word characters")
  return /\w{4,30}$/.test(s);
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "a username is required"],
      unique: true,
      lowercase: true, // convert to lowercase before saving
      minLength: [4, "username must be at least 4 characters"],
      maxLength: [30, "username must be at most 30 characters"],
      validate: [
        isValidUsername,
        "only numbers, letters, or underscores allowed",
      ],
    },
    email: {
      type: String,
      required: [true, "an email is required"],
      unique: true, // the "unique" requirement can't be handled like the others
      lowercase: true, // convert to lowercase before saving
      validate: [isEmail, "invalid email address"],
      select: false,
    },
    password: {
      type: String,
      required: [true, "a password is required"],
      minLength: [6, "password must be at least 6 characters"],
      select: false,
    },

    boj: {
      userId: String,
      levels: {
        type: [Number],
        default: Array(CATEGORIES.length).fill(3),
        validate: [
          // all levels must be integers in the range [3, 28]
          (arr: number[]) => arr.every((level) => 3 <= level && level <= 28),
          "not all levels in the valid range 3 to 28",
        ],
      },
    },
    cf: {
      userId: String,
      levels: {
        type: [Number],
        default: Array(CATEGORIES.length).fill(1400),
      },
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: IUser, next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser> | never {
  username = username.toLowerCase();
  // password is excluded by default
  const user = await this.findOne({ username }, "+password");
  if (!user) {
    throw new Error("that username is not registered");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("that password is incorrect");
  }
  return user;
};

export const User = mongoose.model<IUser>("User", userSchema);
