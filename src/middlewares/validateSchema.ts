import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

// Middleware para validar el esquema de la solicitud usando Zod
const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar el cuerpo de la solicitud contra el esquema proporcionado
      await schema.parseAsync(req.body);
      next(); // Continuar si la validación es exitosa
    } catch (error) {
      // Responder con un error 400 si la validación falla
      res.status(400).json({ error });
    }
  };
}

export default validateSchema;
