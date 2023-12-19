import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JSONInterceptor } from './json.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JSONInterceptor, multi: true },
];
