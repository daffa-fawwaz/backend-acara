import { Request, Response } from "express";

import * as Yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";


type Tregister = {
    fullName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

type Tlogin = {
    identifier: string,
    password: string
}

const registerValidatedSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password not match")
})

export default {
    async register(req: Request, res: Response) {

        const {fullName, username, email, password, confirmPassword} = 
        req.body as unknown as Tregister 


        try {
            await registerValidatedSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword
        })

        const result = await userModel.create({
            fullName,
            username,
            email,
            password
        });

            res.status(200).json({
                message: "Registration success",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null
            })
        }


    },

    async login(req: Request, res: Response) {

        /**
            #swagger.requestBody = {
                required: true,
                schema: {
                    $ref: "#/components/schemas/loginRequest"
                }
            }
         */

        const {identifier, password} = req.body as unknown as Tlogin;

        try {

            const userByIdentifier = await userModel.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    username: identifier
                }
            ]
        })

        if(!userByIdentifier) {
            return res.status(403).json({
                message: "User not found",
                data: null
            })
        }

        const validatePassword: boolean = encrypt(password) === userByIdentifier.password

        if(!validatePassword) {
            return res.status(403).json({
                message: "Password atau email yang anda masukan salah",
                data: null
            })
        }

        const token = generateToken({
            id: userByIdentifier._id.toString(),
            role: userByIdentifier.role,
        });

        res.status(200).json({
            message: "Login succes",
            data: token
        })


            
        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null
            })
        }

        
    },

    async me(req: IReqUser, res: Response) {

        /**
            #swagger.security = [{
                "bearerAuth": []
            }]
         */
        try {
            const user = req.user
            const result = await userModel.findById(user?.id)

            res.status(200).json({
                message: "Success",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    }
}