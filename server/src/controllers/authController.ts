import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  };

  register = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await this.authService.register(username, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await this.authService.validateUser(username, password);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      (req.session as any).userId = user._id;
      (req.session as any).username = user.username;

      res.json({ message: "Login successful" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.json({ message: "Logout successful" });
    });
  }
}