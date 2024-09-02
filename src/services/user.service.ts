import UserExistError from "../exceptions/UserExistError";
import NotAuthorizedError from "../exceptions/NotAuthorizedError";
import { UserDocument, UserInput } from "../models/user.model";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  async createUser(user: UserInput): Promise<UserDocument> {
    try {
      const userExist = await this.findByEmail(user.email);
      if (userExist) {
        throw new UserExistError("Email already exists");
      }
      user.password = await bcrypt.hash(user.password, 10);
      return await UserModel.create(user);
    } catch (error) {
      throw error;
    }
  }

  public async login(userInput: any) {
    try {
      const userExist = await this.findByEmail(userInput.email);
      if (!userExist) throw new NotAuthorizedError("Not authorized");

      const isMatch: boolean = await bcrypt.compare(
        userInput.password,
        userExist.password
      );

      if (!isMatch) throw new NotAuthorizedError("Not authorized");
      const token = this.generateToken(userExist);
      return {
        email: userExist.email,
        name: userExist.name,
        role: userExist.role,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await UserModel.find();
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, user: UserInput): Promise<UserDocument | null> {
    try {
      return await UserModel.findByIdAndUpdate(id, user, {
        returnOriginal: false,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: UserDocument): string {
    try {
      return jwt.sign(
        { email: user.email, name: user.name, user_id: user._id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "60m" }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
