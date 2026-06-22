import { HttpError } from "./http";
import { isContentData } from "../../shared/content";
import type { ContentData } from "../../shared/content";

interface GitHubFile {
  content: string;
  encoding: string;
  sha: string;
}

const getGitHubConfig = () => {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const path = process.env.GITHUB_CONTENT_PATH || "content/content.json";

  if (!token || !repository) {
    throw new HttpError(503, "La persistencia con GitHub no está configurada");
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) {
    throw new HttpError(500, "GITHUB_REPO no tiene el formato usuario/repositorio");
  }
  if (!path || path.startsWith("/") || path.includes("..")) {
    throw new HttpError(500, "GITHUB_CONTENT_PATH no es válido");
  }

  return { token, repository, branch, path };
};

const getHeaders = (token: string) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "portal-edu-stream",
});

const getFileUrl = (repository: string, path: string, branch: string) => {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repository}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
};

const getRemoteFile = async (): Promise<GitHubFile | null> => {
  const config = getGitHubConfig();
  const response = await fetch(getFileUrl(config.repository, config.path, config.branch), {
    headers: getHeaders(config.token),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error("GitHub read failed", response.status, await response.text());
    throw new HttpError(502, "No se ha podido leer el contenido desde GitHub");
  }

  const file = await response.json() as Partial<GitHubFile>;
  if (typeof file.content !== "string" || typeof file.sha !== "string" || file.encoding !== "base64") {
    throw new HttpError(502, "GitHub ha devuelto un archivo de contenido no válido");
  }
  return file as GitHubFile;
};

export const readContentFromGitHub = async (): Promise<ContentData | null> => {
  const file = await getRemoteFile();
  if (!file) return null;

  try {
    const decoded = Buffer.from(file.content.replace(/\s/g, ""), "base64").toString("utf8");
    const content: unknown = JSON.parse(decoded);
    if (!isContentData(content)) throw new Error("Invalid content shape");
    return content;
  } catch (error) {
    console.error("Invalid content file", error);
    throw new HttpError(502, "El archivo de contenido de GitHub no es válido");
  }
};

export const writeContentToGitHub = async (content: ContentData) => {
  const serialized = `${JSON.stringify(content, null, 2)}\n`;
  if (Buffer.byteLength(serialized) > 900_000) {
    throw new HttpError(413, "El contenido supera el límite permitido de 900 KB");
  }

  const config = getGitHubConfig();
  const currentFile = await getRemoteFile();
  const encodedPath = config.path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`https://api.github.com/repos/${config.repository}/contents/${encodedPath}`, {
    method: "PUT",
    headers: {
      ...getHeaders(config.token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Actualizar contenido del portal",
      content: Buffer.from(serialized, "utf8").toString("base64"),
      branch: config.branch,
      ...(currentFile ? { sha: currentFile.sha } : {}),
    }),
  });

  if (!response.ok) {
    console.error("GitHub write failed", response.status, await response.text());
    throw new HttpError(502, "No se ha podido guardar el contenido en GitHub");
  }

  const result = await response.json() as { commit?: { sha?: string } };
  return result.commit?.sha ?? null;
};
