import UserModel from "../features/user/userModel";
import * as jwt from "jsonwebtoken"

const jwtAuth = async(req, res, next) => {
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await UserModel.findById(decoded.id).select('-password')

            next()
        } catch (e) {
            res.status(401).json({ error: "Not authorized" })
        }
    }

    if (!req.headers.authorization?.startsWith('Bearer')) {
        res.status(401).json({ error: "Not authorized" })
    }
}

export {
    jwtAuth
}