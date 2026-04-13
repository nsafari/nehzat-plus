import { environment } from '../../../environments/environment';

function trimTrailingSlash(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function resolveApiBaseUrl(): string {
  const runtimeApiUrl = (window as unknown as { __apiBase?: string }).__apiBase ?? '';
  const configuredApiUrl = runtimeApiUrl || environment.apiUrl || '';
  return trimTrailingSlash(configuredApiUrl);
}

export function resolvePublicApiBaseUrl(): string {
  const runtimeApiUrl = (window as unknown as { __apiBase?: string }).__apiBase ?? '';
  const configuredPublicUrl = environment.apiPublicUrl || runtimeApiUrl || environment.apiUrl || '';
  return trimTrailingSlash(configuredPublicUrl);
}

export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) {
    return null;
  }

  const raw = pathOrUrl.trim();
  if (!raw) {
    return null;
  }

  if (/^(https?:|blob:|data:)/i.test(raw)) {
    return raw;
  }

  const base = resolvePublicApiBaseUrl();
  if (!base) {
    return raw;
  }

  return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
}
