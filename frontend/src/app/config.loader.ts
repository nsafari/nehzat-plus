export function loadApiConfig(): () => Promise<void> {
  return () => {
    const base = document.querySelector('base')?.href ?? '/';
    const configUrl = `${base}config.json`;

    return fetch(configUrl)
      .then((response) => {
        if (!response.ok) {
          console.warn(`[ConfigLoader] config.json unavailable (HTTP ${response.status}) — falling back to environment defaults`);
          return {};
        }
        return response.json().catch((err) => {
          console.error(`[ConfigLoader] invalid JSON in ${configUrl} — falling back to environment defaults`, err);
          return {};
        });
      })
      .then((config: { apiUrl?: string; otuh2Url?: string }) => {
        const win = window as unknown as { __apiBase?: string; __otuh2Base?: string };
        if (typeof config.apiUrl === 'string') {
          win.__apiBase = config.apiUrl;
        }
        if (typeof config.otuh2Url === 'string') {
          win.__otuh2Base = config.otuh2Url;
        }
      })
      .catch((err) => {
        console.error(`[ConfigLoader] failed to load ${configUrl} — falling back to environment defaults`, err);
      });
  };
}
