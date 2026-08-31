import { NextResponse } from "next/server";

import { generateProfessionalResponse } from "@/lib/apps/professional-responder/generate";
import { professionalResponderRequestSchema } from "@/lib/apps/professional-responder/schema";
import { authenticateApplication } from "@/lib/auth/apiKey";
import { unauthorizedResponse } from "@/lib/auth/unauthorized";

export async function POST(request: Request) {
  if (!authenticateApplication(request, "professional-responder")) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    const parsed = professionalResponderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "A valid input is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await generateProfessionalResponse(parsed.data.input);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Professional Responder generation error:", error);

    return NextResponse.json(
      {
        error: "We couldn't generate the professional response.",
      },
      {
        status: 500,
      },
    );
  }
}
