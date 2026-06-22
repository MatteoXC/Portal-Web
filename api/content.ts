import { requireAuthentication } from "./_lib/auth.js";
import { readContentFromGitHub, writeContentToGitHub } from "./_lib/github.js";
import { handleApiError, HttpError, readJsonBody, sendJson } from "./_lib/http.js";
import type { ApiRequest, ApiResponse } from "./_lib/http.js";
import { isContentData } from "../shared/content.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    if (request.method === "GET") {
      const content = await readContentFromGitHub();
      sendJson(response, 200, { content });
      return;
    }

    if (request.method === "PUT") {
      requireAuthentication(request);
      const body = await readJsonBody(request);
      const content = body && typeof body === "object" && "content" in body
        ? (body as { content?: unknown }).content
        : undefined;

      if (!isContentData(content)) throw new HttpError(400, "El contenido enviado no es válido");
      const commitSha = await writeContentToGitHub(content);
      sendJson(response, 200, { saved: true, commitSha });
      return;
    }

    response.setHeader("Allow", "GET, PUT");
    sendJson(response, 405, { error: "Método no permitido" });
  } catch (error) {
    handleApiError(response, error);
  }
}
