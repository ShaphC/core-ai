import { timingSafeEqual } from "crypto";

type Application = "actionsteps";

const applicationKeys: Record<Application, string | undefined> = {
  actionsteps: process.env.ACTIONSTEPS_API_KEY,
};

export function authenticateApplication(
  request: Request,
  application: Application,
): boolean {
  const providedKey = request.headers.get("x-core-ai-key");
  const expectedKey = applicationKeys[application];

  if (!providedKey || !expectedKey) {
    return false;
  }

  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(expectedKey);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
