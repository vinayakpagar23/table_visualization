// import 'dotenv/config'
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log("Server Started on PORT:: ",process.env.PORT);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error ::: ",err);
});
