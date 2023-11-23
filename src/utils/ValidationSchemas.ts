import { z } from "zod";

export const LoginSchema = z.object({
  // In this example we will only validate the request body.
  body: z.object({
    // email should be valid and non-empty
    email: z.string().email(),
    // password should be at least 6 characters
    password: z.string().min(6),
  }),
});

export const RegisterSchema = z.object({
  // In this example we will only validate the request body.
  body: z.object({
    // name shoulb be valid and non-empty
    name: z.string(),
    // email should be valid and non-empty
    email: z.string().email().trim(),
    // password should be at least 6 characters
    password: z.string().min(6),
  }),
});
