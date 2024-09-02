import { Request, Response } from "express";
import { UserDocument, UserInput } from "../models/user.model";
import UserService from "../services/user.service";
import UserExistError from "../exceptions/UserExistError";
import NotAuthorizedError from "../exceptions/NotAuthorizedError";

class UsersController {
  public getUsers = async (req: Request, res: Response) => {
    return res.status(200).json(await UserService.findAll());
  };

  public getUserByEmail = async (req: Request, res: Response) => {
    try {
      const user: UserDocument | null = await UserService.findByEmail(
        req.params.email
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    // res.send("Get user with id: " + req.params.id);
    try {
      const user: UserDocument | null = await UserService.findById(
        req.params.id
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  public getUserByIdAndGroupId = (req: Request, res: Response) => {
    res.send(
      "Get user with id: " + req.params.id + " y grupo: " + req.params.groupdId
    );
  };

  public createUser = async (req: Request, res: Response) => {
    // res.status(201).send("Created a user with email: " + req.body.email);
    try {
      const user: UserDocument = await UserService.createUser(
        req.body as UserInput,
      );
      return res.status(201).json({ user });
    } catch (error) {
      if (error instanceof UserExistError) {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json(error);
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    // res.send("User updated");
    try {
      const updateUser: UserDocument | null = await UserService.updateUser(
        req.params.id,
        req.body as UserInput
      );
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ updateUser });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    // res.send("User deleted");
    try {
      const deleteUser: UserDocument | null = await UserService.deleteUser(
        req.params.id
      );
      if (!deleteUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ deleteUser });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  public async login(req: Request, res: Response) {
    try {
      const userObj = await UserService.login(req.body);
      res.status(200).json(userObj);
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        res.status(400).json({ message: "Not authorized" });
        return;
      }
      res.status(500).json(error);
    }
  }
}

export default new UsersController();