import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

let errorCount = 0;
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        errorCount++;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          notify.show(
            `${errorCount} درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.`,
            'error'
          );
          errorCount = 0;
        }, 500);
      }
      return throwError(() => error);
    })
  );
};