import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Table } from "../models/table.module.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const insertTable = asyncHandler(async (req, res) => {
  try {
    const { tableName, columns } = req.body;
    if (!tableName) {
      throw new ApiError(400, "Table Name is Required !");
    }
    const { _id } = req.user;
    await Table.create({
      tableName,
      columns,
      owner: _id,
    });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Table added SuccessFully !"));
  } catch (error) {
    console.log("Error while inserting Table ::: ", error);
    throw new ApiError(400, "Table not added !");
  }
});

const getTables = asyncHandler(async (req, res) => {
  try {
    const owner = req.user._id;
    const tablesList = await Table.find({
      owner: owner,
    });
    console.log("tableList :: ",tablesList);
    res
      .status(200)
      .json(new ApiResponse(200, tablesList, "SuccessFully fetch tables !"));
  } catch (error) {
    console.log("error while fetching tables :: ", error);
    throw new ApiError(400, "Not able to fetch tables !");
  }
});

export { insertTable, getTables };
