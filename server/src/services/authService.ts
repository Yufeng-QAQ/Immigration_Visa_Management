import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user";

export class AuthService {
  async register(username: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, password: hashedPassword});
    return await newUser.save();
  }

  async validateUser(username: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ username }).select("+password");
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async getUserByName(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
}