import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail";

export interface TagLevels {
  math: number;
  string: number;
  dp: number;
  graphs: number;
  data_structures: number;
  flow: number;
  divide_and_conquer: number;
  greedy: number;
  geometry: number;
  misc: number;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;

  boj: {
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
    },
    password: {
      type: String,
      required: [true, "a password is required"],
      minLength: [6, "password must be at least 6 characters"],
    },

    boj: {
      userId: String,
      levels: [Number],
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
  const user = await this.findOne({ username }).exec();
  if (user == null) {
    throw new Error("that username is not registered");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("that password is incorrect");
  }
  return user;
};

export const User = mongoose.model<IUser>("User", userSchema);
