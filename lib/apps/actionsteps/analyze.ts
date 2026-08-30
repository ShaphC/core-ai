import { openai } from "@/lib/openai/client";
import {
  actionStepsSchema,
  type ActionStepsResult,
} from "@/lib/apps/actionsteps/schema";
import { ACTIONSTEPS_SYSTEM_PROMPT } from "@/lib/apps/actionsteps/prompt";
import { zodTextFormat } from "openai/helpers/zod";

export async function analyzeActionSteps(
  transcript: string,
): Promise<ActionStepsResult> {
  const result = await openai.responses.parse({
    model: "gpt-5-mini",
    instructions: ACTIONSTEPS_SYSTEM_PROMPT,
    input: [
      {
        role: "user",
        content: transcript,
      },
    ],
    text: {
      format: zodTextFormat(actionStepsSchema, "actionsteps_result"),
    },
  });

  if (!result.output_parsed) {
    throw new Error("The AI returned an invalid ActionSteps response.");
  }

  return actionStepsSchema.parse(result.output_parsed);
}
