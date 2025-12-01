import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import initDB, { pool } from "./cofig/db";
import config from "./cofig";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = config.port;

//parser
app.use(express.json());

//DB 
initDB();
//middleware
const logger = (req: Request, res: Response, next: NextFunction)=>{
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
}

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello  !!!");
  
});

//users CURD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, age, phone, address]
    );
    // console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data Instered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//all user
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//single user
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "User fetch successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


//update
app.put("/users/:id", async (req: Request, res: Response) => {
  const {name, email, phone} = req.body;
  try {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`, [name, email, phone, req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "User Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//Delete
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    console.log(result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//? todos CURD

app.post("/todos", async(req: Request, res:Response) =>{
  const {user_id, title, description} = req.body;

  try {
    const result = await pool.query(`INSERT INTO todos(user_id, title, description) VALUES($1, $2, $3) RETURNING *`, [user_id, title,description])
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
})

//all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

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
});

//single TODO
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [
      req.params.id,
    ]);

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
});

//update TOdo
app.put("/todos/:id", async (req: Request, res: Response) => {
  const {title} = req.body;
  try {
    const result = await pool.query(`UPDATE todos SET title=$1 WHERE id=$2 RETURNING *`, [title, req.params.id]);

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
});

//Delete TOdO
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [
      req.params.id,
    ]);

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
});

app.use((req, res) =>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
