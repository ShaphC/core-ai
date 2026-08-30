import { openai } from "@/lib/openai/client";

export async function transcribeAudio(file: File): Promise<string> {
  if (!file) {
    throw new Error("Audio file is required.");
  }

  const response = await openai.audio.transcriptions.create({
    file,
    model: "gpt-4o-mini-transcribe",
  });

  const transcript = response.text?.trim();

  if (!transcript) {
    throw new Error("Transcription returned an empty result.");
  }

  return transcript;
}
