import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken =await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token !");
    console.log("Error to create access Token :: ",error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Field Are compulsory");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  // console.log(existedUser)
  if (existedUser) {
    throw new ApiError(409, "User or email Already exist");
  }

  const response = await User.create({
    userName,
    email,
    password,
  });
  // console.log("response ::: ",response);

  const _id = response._id;
  const isUserRegistered = await User.findOne({ _id }).select(
    "-password -refreshToken"
  );
  // console.log("is User Registered :: ",isUserRegistered);

  if (isUserRegistered) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, isUserRegistered, "user Register successFully !")
      );
  } else {
    throw new ApiError(408, "User Not Added !!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      throw new ApiError(400, "userName and Password Required !");
    }

    const user = await User.findOne({ userName }).select(
      "--password --refreshToken"
    );
    if (!user) {
      throw new ApiError(404, "user not Found !!");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password);
    if (!isPasswordvalid) {
      throw new ApiError(401, "Password Incorrect !");
    }

    const { accessToken, refreshToken } = await generateAccessToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: user,
            accessToken,
            refreshToken,
          },
          "user Logged In SuccessFully !"
        )
      );
  } catch (error) {
    console.log("error :: ", error);
    throw new ApiError(500, "Something went Wrong !!");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user._id;

    await User.findByIdAndUpdate(
      {
        _id,
      },
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logout SuccessFully !"));
  } catch (error) {
    console.log("error in logout :: ", error);
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "UnAuthorized request !");
    }

    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh Token !!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refreshed Token Expired !!");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await generateAccessToken(
      user._id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed successfully !"
        )
      );
  } catch (error) {
    console.log("Error  while doing refresh token :: ", error);
    throw new ApiError(401, "Invalid Refresh token !!");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid password !");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password change SuccessFully !"));
  } catch (error) {
    console.log("Error while changing password ::; ", error);
    throw new ApiError(500, "Something went Wrong !");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "Current User fetch successFully !");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
