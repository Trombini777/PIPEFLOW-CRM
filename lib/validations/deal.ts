import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(2, "Informe o título do negócio."),
  leadId: z.string().min(1, "Selecione o lead vinculado."),
  value: z.number().positive("O valor deve ser maior que zero."),
  stage: z.enum([
    "novo_lead",
    "contato_realizado",
    "proposta_enviada",
    "negociacao",
    "fechado_ganho",
    "fechado_perdido",
  ]),
  owner: z.string().min(2, "Informe o responsável."),
  dueDate: z.string().min(1, "Informe o prazo."),
});

export type DealInput = z.infer<typeof dealSchema>;
