import { Request, Response } from "express";

export const sendHello = async (req: Request, res: Response,) => {
  try {
    res.status(200).json({ "message": "Hello World!" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
