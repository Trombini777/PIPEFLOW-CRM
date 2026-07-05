import { z } from "zod";

export const inviteSchema = z.object({
  email: z.email("Digite um e-mail válido."),
  role: z.enum(["admin", "member"]),
});

export type InviteInput = z.infer<typeof inviteSchema>;
