import { z } from "zod";

export const professionalResponderRequestSchema = z.object({
  input: z.string().trim().min(1),
});

export type ProfessionalResponderRequest = z.infer<
  typeof professionalResponderRequestSchema
>;

export const professionalResponderSchema = z.object({
  professional_text: z.string(),
});

export type ProfessionalResponderResult = z.infer<
  typeof professionalResponderSchema
>;
