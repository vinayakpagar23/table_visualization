// import 'dotenv/config'
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

const app = express();

connectDB();
app.listen(3004,()=>{
    console.log("App is running")
})