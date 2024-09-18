import mongoose, { Schema } from "mongoose";

const ColumnSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
});

const TableSchema = new Schema(
  {
    tableName: {
      type: String,
      required: [true, "TableName is required"],
      unique: true,
      trim: true,
      index: true,
    },
    columns: {
      type: [ColumnSchema],
      required: true,
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required:true
    },
  },
  {
    timestamps: true,
  }
);

export const Table = mongoose.model("Table", TableSchema);
