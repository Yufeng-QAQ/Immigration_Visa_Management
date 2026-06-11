import { Request, Response, NextFunction } from "express";

export function userAuthenticate(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ message: "Unauthorized User, Please Login" });
  }
  next();
}