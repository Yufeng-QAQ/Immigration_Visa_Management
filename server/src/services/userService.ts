import User, { IUser } from "../models/user";
import bcrypt from "bcryptjs";

export class UserService {
  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async createUser(data: Partial<IUser>): Promise<IUser | null> {
    if (!data.password) return null;
    const password = data.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    data.password = hashedPassword;
    const newUser = new User(data);
    return newUser.save();
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }
}
