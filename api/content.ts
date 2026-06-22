import { requireAuthentication } from "./_lib/auth";
import { readContentFromGitHub, writeContentToGitHub } from "./_lib/github";
import { handleApiError, HttpError, readJsonBody, sendJson } from "./_lib/http";
import type { ApiRequest, ApiResponse } from "./_lib/http";
import { isContentData } from "../shared/content";

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
