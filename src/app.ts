import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routers";
import { todoRouter } from "./modules/todo/todo.routers";
import { authRoutes } from "./modules/auth/auth.routes";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();

//parser
app.use(express.json());

//Initial DB 
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developer !!!");
  
});

//users & Todo  CURD
app.use("/users", userRoutes);

app.use("/todos", todoRouter);

app.use("/auth", authRoutes);

app.use((req, res) =>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})

export default app;