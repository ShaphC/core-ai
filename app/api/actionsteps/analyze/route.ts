import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeActionSteps } from "@/lib/apps/actionsteps/analyze";

const requestSchema = z.object({
  transcript: z.string().trim().min(1, "Transcript is required."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "A valid transcript is required.",
        },
        { status: 400 },
      );
    }

    const result = await analyzeActionSteps(validation.data.transcript);

    return NextResponse.json(result);
  } catch (error) {
    console.error("ActionSteps analysis error:", error);

    return NextResponse.json(
      { error: "We couldn't analyze that transcript." },
      { status: 500 },
    );
  }
}
