import { isAuthenticated } from "../_lib/auth";
import { handleApiError, sendJson } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/http";

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendJson(response, 405, { error: "Método no permitido" });
    return;
  }

  try {
    sendJson(response, 200, { authenticated: isAuthenticated(request) });
  } catch (error) {
    handleApiError(response, error);
  }
}
