import { z } from "zod";

export const activitySchema = z.object({
  type: z.enum(["ligacao", "email", "reuniao", "nota"]),
  description: z.string().min(3, "Descreva a atividade."),
});

export type ActivityInput = z.infer<typeof activitySchema>;
