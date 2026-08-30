import { openai } from "@/lib/openai/client";
import {
  actionStepsSchema,
  type ActionStepsResult,
} from "@/lib/apps/actionsteps/schema";
import { ACTIONSTEPS_SYSTEM_PROMPT } from "@/lib/apps/actionsteps/prompt";

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
      format: {
        type: "json_schema",
        name: "actionsteps_result",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            summary: {
              type: "string",
            },
            actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  title: {
                    type: "string",
                  },
                  details: {
                    type: "string",
                  },
                  priority: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                  completed: {
                    type: "boolean",
                  },
                },
                required: ["id", "title", "details", "priority", "completed"],
                additionalProperties: false,
              },
            },
            questions: {
              type: "array",
              items: {
                type: "string",
              },
            },
            dependencies: {
              type: "array",
              items: {
                type: "string",
              },
            },
            decisions: {
              type: "array",
              items: {
                type: "string",
              },
            },
            next_step: {
              type: "string",
            },
          },
          required: [
            "title",
            "summary",
            "actions",
            "questions",
            "dependencies",
            "decisions",
            "next_step",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  if (!result.output_parsed) {
    throw new Error("The AI returned an invalid ActionSteps response.");
  }

  return actionStepsSchema.parse(result.output_parsed);
}
