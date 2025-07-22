import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello world",
        data: null
    })
})

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', authMiddleware, authController.me)

export default router;