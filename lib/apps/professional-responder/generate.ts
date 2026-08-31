import { openai } from "@/lib/openai/client";
import {
  professionalResponderSchema,
  type ProfessionalResponderResult,
} from "@/lib/apps/professional-responder/schema";
import { PROFESSIONAL_RESPONDER_SYSTEM_PROMPT } from "@/lib/apps/professional-responder/prompt";

export async function generateProfessionalResponse(
  input: string,
): Promise<ProfessionalResponderResult> {
  const result = await openai.responses.parse({
    model: "gpt-5-mini",
    instructions: PROFESSIONAL_RESPONDER_SYSTEM_PROMPT,
    input: [
      {
        role: "user",
        content: input,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "professional_responder_result",
        strict: true,
        schema: {
          type: "object",
          properties: {
            professional_text: {
              type: "string",
            },
          },
          required: ["professional_text"],
          additionalProperties: false,
        },
      },
    },
  });

  if (!result.output_parsed) {
    throw new Error(
      "The AI returned an invalid Professional Responder response.",
    );
  }

  return professionalResponderSchema.parse(result.output_parsed);
}
