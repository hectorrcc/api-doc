import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/userModel";
import { MessagesError } from "../types/types";




export const verifyToken = async (req: Request, res: Response, next: Function)=>{
    const secret = process.env.SECRET as string
    const {userToken} = req.cookies

    if (!userToken) {
        return res.status(401).json({message: MessagesError.NO_TOKEN_PROVIDER})
    }

    try {
        const tokenDecode =  jwt.verify(userToken, secret) as JwtPayload
        const user = await new UserModel().findFirst({id:tokenDecode.id})
        if (user == null) {
            throw new Error
        }

        req.userId = user.id
        req.userRole = user.role
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({message: MessagesError.UNAUTHORIZED})
    }

}