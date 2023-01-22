import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { UserDoc } from "../models/User";

const createUserToken = async (user: UserDoc, req: Request, res: Response) => {
  const token = sign(
    {
      name: user.name,
      id: user._id,
    },
    "secret"
  );

  res
    .status(200)
    .json({ message: "You are authenticated", token, userId: user._id });
};

export default createUserToken;
