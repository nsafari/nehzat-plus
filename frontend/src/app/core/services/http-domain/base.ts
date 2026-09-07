import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-url.util';

export type Constructor<T = {}> = new (...args: any[]) => T;

export interface HttpServiceContext {
  http: HttpClient;
  url(path: string): string;
}

// Concrete root for the http mixin chain: provides the http/url members every domain mixin expects.
export class HttpServiceContextBase implements HttpServiceContext {
  constructor(public readonly http: HttpClient) {}

  url(path: string): string {
    return `${resolveApiBaseUrl()}${path}`;
  }
}
