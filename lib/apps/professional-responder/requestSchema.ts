import { z } from "zod";

export const professionalResponderRequestSchema = z.object({
  input: z.string().trim().min(1),
});

export type ProfessionalResponderRequest = z.infer<
  typeof professionalResponderRequestSchema
>;
