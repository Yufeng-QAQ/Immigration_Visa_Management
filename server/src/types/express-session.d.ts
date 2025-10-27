import "express-session";
import { Express } from 'express';

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}