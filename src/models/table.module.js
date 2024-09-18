import mongoose, { Schema } from "mongoose";

const TableSchema = new Schema(
  {
    tableName: {
      type: String,
      required: [true, 'TableName is required'],
      unique: true,
      trim: true,
      index: true
    },
    columns: {
      type: Array, 
      required: true,
      default: []
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
  },
  {
    timestamps: true
  }
);


export const Table = mongoose.model("Table", TableSchema);
