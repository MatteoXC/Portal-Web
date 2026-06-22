import { createSessionCookie, verifyPassword } from "../_lib/auth.js";
import { handleApiError, HttpError, readJsonBody, sendJson } from "../_lib/http.js";
import type { ApiRequest, ApiResponse } from "../_lib/http.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { error: "Método no permitido" });
    return;
  }

  try {
    const body = await readJsonBody(request, 10_000);
    const password = body && typeof body === "object" && "password" in body
      ? (body as { password?: unknown }).password
      : undefined;

    if (typeof password !== "string") throw new HttpError(400, "Debes indicar la contraseña");
    if (!verifyPassword(password)) throw new HttpError(401, "Contraseña incorrecta");

    response.setHeader("Set-Cookie", createSessionCookie(request));
    sendJson(response, 200, { authenticated: true });
  } catch (error) {
    handleApiError(response, error);
  }
}
