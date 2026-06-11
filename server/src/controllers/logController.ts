import { Request, Response } from "express";
import {LogService} from "../services/logService";

export class LogController {
  private logService: LogService;

  constructor() {
    this.logService = new LogService();
  }

  getLogs = async (req: Request, res: Response) => {
    try {
      const logs = await this.logService.getLogs();
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
} 