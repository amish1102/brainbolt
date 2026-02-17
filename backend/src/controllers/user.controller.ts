import { Request, Response } from "express";
import { createUser } from "../repositories/user.repository";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const userId = await createUser();

    res.status(201).json({
      userId,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
