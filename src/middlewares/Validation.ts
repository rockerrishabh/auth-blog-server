import { NextFunction, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "../utils/ValidationSchemas";
import { z } from "zod";

export const loginValidation =
  (schema: typeof LoginSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
    }
  };

export const registerValidation =
  (schema: typeof RegisterSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
    }
  };
