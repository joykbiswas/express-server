import express  from 'express';
import { todoController } from './todo.controller';

const router = express.Router();
// app.use("/todos", useRoute);
// router -> controller -> service

router.post( "/", todoController.createTodo);

router.get("/", todoController.getTodo);

router.get("/:id", todoController.getSingleUser);

router.put("/:id", todoController.updateTodo);

router.delete("/:id", todoController.deleteTodo);

export const todoRouter = router;