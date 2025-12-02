import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todoService } from "./todo.service";

const createTodo =  async (req: Request, res:Response) =>{

  try {
    const result = await todoService.createTodo(req.body)
    res.status(201).json({
      success: true,
      message: "Todos created",
      data: result.rows[0]
    })
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error.message,

    })
  }
}

const getTodo =  async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodo();

    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getSingleTodo(req.params.id!)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Todos fetch successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const updateTodo =  async (req: Request, res: Response) => {
  const {title} = req.body;
  try {
    const result = await todoService.UpdateTodo(title, req.params.id!)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todo Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteTodo =  async (req: Request, res: Response) => {
  try {
    const result = await todoService.deleteTodo(req.params.id!)

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todo Deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const todoController = {
    createTodo,
    getTodo,
    getSingleUser,
    updateTodo,
    deleteTodo
}