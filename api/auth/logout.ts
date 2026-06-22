import { clearSessionCookie } from "../_lib/auth.js";
import { sendJson } from "../_lib/http.js";
import type { ApiRequest, ApiResponse } from "../_lib/http.js";

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { error: "Método no permitido" });
    return;
  }

  response.setHeader("Set-Cookie", clearSessionCookie(request));
  sendJson(response, 200, { authenticated: false });
}
