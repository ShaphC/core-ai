import { NextResponse } from "next/server";

import { transcribeAudio } from "@/lib/openai/transcription";
import { authenticateApplication } from "@/lib/auth/apiKey";
import { unauthorizedResponse } from "@/lib/auth/unauthorized";

export async function POST(request: Request) {
  if (!authenticateApplication(request, "professional-responder")) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "An audio file is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The audio file is empty.",
        },
        {
          status: 400,
        },
      );
    }

    const transcript = await transcribeAudio(file);

    return NextResponse.json({
      transcript,
    });
  } catch (error) {
    console.error("Professional Responder transcription error:", error);

    return NextResponse.json(
      {
        error: "We couldn't transcribe that audio.",
      },
      {
        status: 500,
      },
    );
  }
}
