import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  QrCodeResponse,
  QrPollResponse,
  QrScanConfirm,
} from '../../models/lesson-planner.models';

interface QrSession {
  sessionId: string;
  qrData: string;
  expiresAt: Date;
  status: 'pending' | 'confirmed' | 'expired';
  scannedByUsername?: string;
  confirmedAt?: Date;
  confirmedToken?: string;
}

/** In-memory QR session store (module-level singleton). */
const qrSessions: QrSession[] = [];

function delayed<T>(value: T): Observable<T> {
  return of(value).pipe(delay(300));
}

/**
 * QR Login mock implementation.
 * NOTE: Currently not wired into the mock delegation chain.
 * Methods are standalone and self-contained.
 */
export function requestQrCode(payload?: { deviceInfo?: string }): Observable<QrCodeResponse> {
  const sessionId = Math.random().toString(36).substring(2, 20);
  const qrData = `NEHZAT-QR:${sessionId}`;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  qrSessions.push({ sessionId, qrData, expiresAt, status: 'pending' });

  return delayed<QrCodeResponse>({ sessionId, qrData, expiresAt });
}

export function pollQrStatus(sessionId: string): Observable<QrPollResponse> {
  const session = qrSessions.find((s) => s.sessionId === sessionId);

  if (!session) {
    return delayed<QrPollResponse>({ status: 'expired' });
  }

  if (session.expiresAt < new Date()) {
    session.status = 'expired';
    return delayed<QrPollResponse>({ status: 'expired' });
  }

  if (session.status === 'confirmed' && session.confirmedToken) {
    return delayed<QrPollResponse>({
      status: 'confirmed',
      token: session.confirmedToken,
      username: session.scannedByUsername,
      userType: 'trainee',
    });
  }

  return delayed<QrPollResponse>({ status: session.status || 'pending' });
}

export function confirmQrScan(payload: { sessionId: string; username: string }): Observable<QrScanConfirm> {
  const session = qrSessions.find((s) => s.sessionId === payload.sessionId);

  if (!session) {
    return delayed<QrScanConfirm>({ status: 'expired', message: 'جلسه یافت نشد' });
  }

  if (session.status !== 'pending') {
    return delayed<QrScanConfirm>({ status: session.status, message: 'QR پردازش شده یا منقضی شده' });
  }

  if (session.expiresAt < new Date()) {
    session.status = 'expired';
    return delayed<QrScanConfirm>({ status: 'expired', message: 'QR منقضی شده' });
  }

  const token = `at+jwt.mock.${payload.username}.${Date.now()}`;
  session.status = 'confirmed';
  session.scannedByUsername = payload.username;
  session.confirmedAt = new Date();
  session.confirmedToken = token;

  return delayed<QrScanConfirm>({ status: 'confirmed', message: 'QR با موفقیت تأیید شد' });
}
