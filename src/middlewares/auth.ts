import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware de autenticación
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers.authorization;
        if (!token) {
            // Retorna un error 401 si no hay token
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            // Elimina "Bearer " del token y lo verifica
            token = token.replace("Bearer ", "");
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
            req.body.loggedUser = decoded; // Almacena el usuario decodificado en req.body
            req.params.idLoggedUser = decoded.user_id; // Almacena el ID del usuario en req.params
            next(); // Pasa al siguiente middleware o controlador
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Retorna un error 401 si el token ha expirado
            return res.status(401).json({ message: "Token expired" });
        }
        // Retorna un error 401 para otros errores de autenticación
        return res.status(401).json({ message: "Unauthorized" });
    }
}

// Middleware de autorización para roles
export const authorize = (req: Request, res: Response, next: NextFunction) => {
    const loggedUser = req.body.loggedUser;
    if (loggedUser.role === "superadmin") {
        // Permite el acceso si el usuario es superadmin
        next();
    } else {
        // Retorna un error 401 si el usuario no es superadmin
        return res.status(401).json({ message: "Unauthorized" });
    }
}
