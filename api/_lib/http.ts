import type { IncomingMessage, ServerResponse } from "node:http";

export interface ApiRequest extends IncomingMessage {
  body?: unknown;
  cookies?: Record<string, string>;
}

export type ApiResponse = ServerResponse;

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export const sendJson = (response: ApiResponse, statusCode: number, body: unknown) => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
};

export const readJsonBody = async (request: ApiRequest, maxBytes = 1_000_000): Promise<unknown> => {
  let parsedBody: unknown;
  try {
    parsedBody = request.body;
  } catch {
    throw new HttpError(400, "El cuerpo JSON no es válido");
  }

  if (parsedBody !== undefined) {
    if (typeof parsedBody === "string" || Buffer.isBuffer(parsedBody)) {
      const serialized = Buffer.isBuffer(parsedBody) ? parsedBody.toString("utf8") : parsedBody;
      if (Buffer.byteLength(serialized) > maxBytes) throw new HttpError(413, "La solicitud es demasiado grande");
      try {
        return JSON.parse(serialized) as unknown;
      } catch {
        throw new HttpError(400, "El cuerpo JSON no es válido");
      }
    }
    if (Buffer.byteLength(JSON.stringify(parsedBody)) > maxBytes) {
      throw new HttpError(413, "La solicitud es demasiado grande");
    }
    return parsedBody;
  }

  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) throw new HttpError(413, "La solicitud es demasiado grande");
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new HttpError(400, "El cuerpo JSON no es válido");
  }
};

export const parseCookies = (request: ApiRequest): Record<string, string> => {
  if (request.cookies) return request.cookies;

  return (request.headers.cookie ?? "").split(";").reduce<Record<string, string>>((cookies, part) => {
    const separator = part.indexOf("=");
    if (separator < 0) return cookies;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!key) return cookies;

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
    return cookies;
  }, {});
};

export const handleApiError = (response: ApiResponse, error: unknown) => {
  if (error instanceof HttpError) {
    sendJson(response, error.statusCode, { error: error.message });
    return;
  }

  console.error(error);
  sendJson(response, 500, { error: "Error interno del servidor" });
};
