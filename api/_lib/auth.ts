import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { ApiRequest } from "./http.js";
import { HttpError, parseCookies } from "./http.js";

export const SESSION_COOKIE = "portal_edu_admin";

const getAuthConfig = () => {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!password || !secret) {
    throw new HttpError(503, "La autenticación del administrador no está configurada");
  }

  return { password, secret };
};

const digest = (value: string) => createHash("sha256").update(value).digest();

const secureEqual = (left: string, right: string) => timingSafeEqual(digest(left), digest(right));

const createSessionToken = (secret: string, password: string) =>
  createHmac("sha256", secret)
    .update("portal-edu-admin-session-v1")
    .update(digest(password))
    .digest("base64url");

export const verifyPassword = (password: string) => {
  const config = getAuthConfig();
  return secureEqual(password, config.password);
};

export const isAuthenticated = (request: ApiRequest) => {
  const { password, secret } = getAuthConfig();
  const token = parseCookies(request)[SESSION_COOKIE];
  return typeof token === "string" && secureEqual(token, createSessionToken(secret, password));
};

export const requireAuthentication = (request: ApiRequest) => {
  if (!isAuthenticated(request)) throw new HttpError(401, "La sesión de administrador no es válida");
};

export const createSessionCookie = (request: ApiRequest) => {
  const { password, secret } = getAuthConfig();
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const isSecure = process.env.VERCEL === "1" || forwardedProtocol === "https";
  const secure = isSecure ? "; Secure" : "";
  return `${SESSION_COOKIE}=${createSessionToken(secret, password)}; Path=/; HttpOnly; SameSite=Strict${secure}`;
};

export const clearSessionCookie = (request: ApiRequest) => {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const isSecure = process.env.VERCEL === "1" || forwardedProtocol === "https";
  const secure = isSecure ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
};
