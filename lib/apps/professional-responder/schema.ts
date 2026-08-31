import { z } from "zod";

export const professionalResponderSchema = z.object({
  professional_text: z.string(),
});

export type ProfessionalResponderResult = z.infer<
  typeof professionalResponderSchema
>;
