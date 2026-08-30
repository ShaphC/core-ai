import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/openai/transcription";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_AUDIO_TYPES = new Set([
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/mpeg",
  "audio/mp3",
  "application/octet-stream",
]);

const ALLOWED_AUDIO_EXTENSIONS = new Set([".m4a", ".mp3"]);

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Audio file is required." },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Audio file is required." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The audio file is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The audio file is too large." },
        { status: 400 },
      );
    }

    const extension = getFileExtension(file.name);

    const validMimeType = ALLOWED_AUDIO_TYPES.has(file.type);
    const validExtension = ALLOWED_AUDIO_EXTENSIONS.has(extension);

    if (!validMimeType && !validExtension) {
      return NextResponse.json(
        { error: "Only M4A and MP3 audio files are supported." },
        { status: 400 },
      );
    }

    const transcript = await transcribeAudio(file);

    return NextResponse.json({
      transcript,
    });
  } catch (error) {
    console.error("ActionSteps transcription error:", error);

    return NextResponse.json(
      { error: "We couldn't transcribe that audio." },
      { status: 500 },
    );
  }
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");

  if (lastDot === -1) {
    return "";
  }

  return filename.slice(lastDot).toLowerCase();
}
