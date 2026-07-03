import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Informe o nome do lead."),
  email: z.email("Digite um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone válido."),
  company: z.string().min(2, "Informe a empresa."),
  role: z.string().min(2, "Informe o cargo."),
  status: z.enum(["novo", "contatado", "qualificado", "convertido", "perdido"]),
});

export type LeadInput = z.infer<typeof leadSchema>;
