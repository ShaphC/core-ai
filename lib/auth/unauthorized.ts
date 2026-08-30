export function unauthorizedResponse() {
  return Response.json(
    {
      error: "Unauthorized.",
    },
    {
      status: 401,
    },
  );
}
