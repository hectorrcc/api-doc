import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { AuthSchemaValidated } from "../schema/AuthSchema";
import Jwt from "jsonwebtoken";

class AuthController {
  constructor(private userModel = new UserModel()) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let loginValidated;

    try {
      loginValidated = await AuthSchemaValidated.validate({
        email,
        password,
      });
      console.log(loginValidated);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }

    try {
      const user = await this.userModel.findFirst({
        email: loginValidated.email,
      });
      console.log(user);
      if (user == null) {
        throw new Error("Invalid user of password");
      }

      const validatePass = await this.userModel.comparePassword(
        loginValidated.password,
        user.password
      );

      console.log(validatePass);
      if (!validatePass) {
        throw new Error("Invalid user of password");
      }

      const secret = process.env.SECRET as string;
      const token = Jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "1h" }
      );

      res
        .cookie("userToken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
          sameSite: "lax",
        })
        .status(200)
        .json({
          message: "ok",
          user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
}

export default AuthController;
