import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorCount = 0;
  private toastTimer: any;

  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          this.collectAndShow(error);
        }
        return throwError(() => error);
      })
    );
  }

  private collectAndShow(error: HttpErrorResponse) {
    this.errorCount++;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastr.error(
        `${this.errorCount} درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.`,
        'خطا در دریافت داده'
      );
      this.errorCount = 0;
    }, 500);
  }
}