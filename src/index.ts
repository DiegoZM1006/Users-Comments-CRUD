import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { routerUsers } from "./routes/users.router";
import { db } from "./config/db";
import { routerComments } from "./routes/comments.router";

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

// Middleware para parsear JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para usuarios y comentarios
app.use("/api/users", routerUsers);
app.use("/api/comments", routerComments);

// Ruta raíz que responde con "Hello World"
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Conexión a la base de datos y arranque del servidor
db.then(() => {
    app.listen(PORT, () => {
        console.log(`DB running on http://localhost:${PORT}`);
    });
})
