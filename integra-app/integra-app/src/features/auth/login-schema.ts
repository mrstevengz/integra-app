import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Correo electronico invalido" }),

  password: z.string().min(1, { error: "La contraseña es necesaria" }),
});

export type LoginForm = z.infer<typeof loginSchema>;
