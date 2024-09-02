import express, {Request, Response} from "express";
import UsersController from "../controllers/users.controller";
import validateSchema from "../middlewares/validateSchema";
import UserSchema from "../schemas/user.schema";
import { auth, authorize } from "../middlewares/auth";

export const routerUsers = express.Router();

// Rutas para la gestion de usuarios en la API
routerUsers.post("/login", UsersController.login); // LOGIN

routerUsers.get("/", auth, UsersController.getUsers); // GET ALL USERS

routerUsers.post("/", validateSchema(UserSchema), auth, authorize, UsersController.createUser);// CREATE A NEW USER

routerUsers.put("/:id", auth, authorize, UsersController.updateUser); // UPDATE A USER

routerUsers.delete("/:id", auth, authorize, UsersController.deleteUser); // DELETE A USER
