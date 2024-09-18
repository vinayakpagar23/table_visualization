import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "8kb",
  })
);

app.use(cookieParser());

// import routes 
import userRouter from "./routes/user.routes.js";
import tableRouter from "./routes/table.routes.js";

app.use("/api/v1/users",userRouter);
app.use("/api/v1/table",tableRouter);

export { app };
