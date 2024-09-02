import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            token = token.replace("Bearer ", "");
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
            req.body.loggedUser = decoded;
            req.params.idLoggedUser = decoded.user_id;
            next();
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    const loggedUser = req.body.loggedUser;
    if (loggedUser.role === "superadmin") {
        next();
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}