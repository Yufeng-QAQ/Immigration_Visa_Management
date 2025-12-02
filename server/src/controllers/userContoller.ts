import { Response, Request } from "express";
import { UserService } from "../services/userService";


export class UserContoller {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  }

  getUserById = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) return res.status(400).json({message: "User ID is required"});

    try {
      const user = await this.userService.getUserById(id)
      if (!user) return res.status(404).json({message: "User not exist."});
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ message: "User fetching failed" });
    }
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Failed to create user", errorMsg: err });
    }
  }

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const updated = await this.userService.updateUser(id, req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: "Update failed" });
    }
  }

  deleteUser = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      if (!id) return res.status(400).json({message: "User ID is required"});

      const deleted = await this.userService.deleteUser(id);
      if (!deleted) return res.status(404).json({message: "Failed to delete user"});
      return res.json(deleted);
    } catch (err) {
      return res.status(500).json({ message: "Delete failed" });
    }
  }
}