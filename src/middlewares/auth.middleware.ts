import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken, IUserTokenPayload } from "../utils/jwt";

export interface IReqUser extends Request {
    user?: IUserTokenPayload
}


export default (req: IReqUser, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization

    if(!authorization) {
        return res.status(401).json({
            message: "Unauthorized",
            data: null
        })
    }

    const [prefix, token] = authorization.split(" ")

    if (!(prefix === "Bearer" && token)) {
        return res.status(401).json({
            message: "Unauthorized",
            data: null
        })
    }

    const user = getUserData(token)

    if(!user) {
        return res.status(401).json({
            message: "Unauthorized",
            data: null
        })
    }

    req.user = user

    next()
}