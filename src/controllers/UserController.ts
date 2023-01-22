import { Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import User, { UserDoc } from "../models/User";
import createUserToken from "../helpers/create-user-token";
import getToken from "../helpers/get-token";
import { verify } from "jsonwebtoken";

export default class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res
        .status(422)
        .json({ message: "Please, fill all the required fields!" });
    }

    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ message: "Passwords do not match, please try again!" });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(422)
        .json({ message: "Email already exist, try using another email!" });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    try {
      await user.save();
      createUserToken(user, req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Please, fill all the required fields!" });
    }

    const emailExists = await User.findOne({ email });

    if (!emailExists) {
      return res.status(422).json({
        message:
          "The email provided was not found, please try again with a valid email!",
      });
    }

    if (emailExists && typeof emailExists.password !== "undefined") {
      const checkPassword = await compare(password, emailExists.password);
      // rest of the code
      if (!checkPassword) {
        return res.status(422).json({
          message: "The password provided is not valid, please try again!",
        });
      }
    }
    //const checkPassword = await compare(password, emailExists.password);
    try {
      await createUserToken(emailExists, req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  }

  static async checkUser(req: Request, res: Response) {
    let currentUser: UserDoc | null = null;

    if (req.headers.authorization) {
      const token = getToken(req);
      if (typeof token === "string") {
        const decoded = verify(token, "secret");
        if (typeof decoded === "object") {
          console.log(decoded);
          currentUser = await User.findById(decoded.id);
          if (currentUser) {
            currentUser = {
              ...currentUser.toObject(),
              password: undefined,
            } as UserDoc;
          }
        }
      }
    }
    res.status(200).json({ currentUser, message: "olá" });
  }
}
