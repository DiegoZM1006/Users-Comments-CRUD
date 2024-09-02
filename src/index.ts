import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { routerUsers } from "./routes/users.router";
import { db } from "./config/db";
import { routerComments } from "./routes/comments.router";

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", routerUsers);
app.use("/api/comments", routerComments);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

db.then(() => {
    app.listen(PORT, () => {
        console.log(`DB running on http://localhost:${PORT}`);
    });
})
