import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UsersSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName is Required]"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required]"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required]"],
      k,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 10);
  next();
});

UsersSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UsersSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UsersSchema.methods.refreshTokenAccessToken = function () {
    return jwt.sign(
        {
          _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      );
};
export const User = mongoose.model("User", UsersSchema);
