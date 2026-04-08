export const resolveFileUrl = (path?: string | null): string | null => {
  if (!path) return null;
  const raw = String(path).trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  const normalizedPath = raw.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;

  const finalBase = "http://localhost:3000";
  return `${finalBase}${cleanPath}`;
};
