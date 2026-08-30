import { z } from "zod";

export const actionSchema = z.object({
  id: z.string(),
  title: z.string(),
  details: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  completed: z.boolean(),
});

export const actionStepsSchema = z.object({
  title: z.string(),
  summary: z.string(),
  actions: z.array(actionSchema),
  questions: z.array(z.string()),
  dependencies: z.array(z.string()),
  decisions: z.array(z.string()),
  next_step: z.string(),
});

export type ActionStepsResult = z.infer<typeof actionStepsSchema>;
export type Action = z.infer<typeof actionSchema>;
