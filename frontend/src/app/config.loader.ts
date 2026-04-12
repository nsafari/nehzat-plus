export function loadApiConfig(): () => Promise<void> {
  return () => {
    const base = document.querySelector('base')?.href ?? '/';
    const configUrl = `${base}config.json`;

    return fetch(configUrl)
      .then((response) => (response.ok ? response.json() : {}))
      .then((config: { apiUrl?: string }) => {
        if (typeof config.apiUrl === 'string') {
          (window as unknown as { __apiBase?: string }).__apiBase = config.apiUrl;
        }
      })
      .catch(() => undefined);
  };
}
