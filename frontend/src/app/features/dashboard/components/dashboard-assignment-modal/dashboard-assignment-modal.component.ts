import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type {
  Assignment,
  StudentAssignmentGateState
} from '../../../../core/models/lesson-planner.models';
import { resolveMediaUrl } from '../../../../core/services/api-url.util';

@Component({
  selector: 'app-dashboard-assignment-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h5>جزئیات تکلیف</h5>
          <button type="button" class="btn-secondary" (click)="close.emit()">بستن</button>
        </header>

        <div class="modal-body">
          <h5>{{ assignment.title }}</h5>
          <p><strong>تاریخ:</strong> {{ assignment.assignmentDate }}</p>
          <p><strong>توضیحات:</strong> {{ assignment.description }}</p>
          <p><strong>دستورالعمل:</strong> {{ assignment.instructions || '-' }}</p>

          @if (assignment.attachments?.length) {
            <div class="attachment-box">
              <h6>فایل‌های ضمیمه:</h6>
              <div class="attachment-list">
                @for (attachment of assignment.attachments; track attachment.id) {
                  <a
                    [href]="resolveAttachmentUrl(attachment.url) || '#'"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="attachment-item"
                  >
                    <i class="bi" [class]="getAttachmentIcon(attachment.kind)"></i>
                    {{ attachment.title }}
                  </a>
                }
              </div>
            </div>
          }

          @if (primaryInstructionAudioUrl) {
            <div class="gate-box">
              <h6>فایل راهنما (پیش‌نیاز ضبط)</h6>
              <audio controls [src]="primaryInstructionAudioUrl"></audio>
              <p class="muted">
                گوش‌دادن کامل:
                {{ progress?.currentListenCount ?? 0 }} /
                {{ progress?.requiredListenCount ?? 3 }}
              </p>
            </div>
          }

          @if (progress) {
            <div class="progress-box">
              <p><strong>وضعیت:</strong> {{ progress.hasSubmission ? 'تکمیل شده' : 'در انتظار تکمیل' }}</p>
              <p><strong>نمره روزانه:</strong> {{ progress.latestSubmission?.dailyScore ?? '-' }}</p>
              <p><strong>نمره تجمعی:</strong> {{ progress.latestSubmission?.cumulativeScore ?? '-' }}</p>
              @if (progress.latestSubmission?.feedback) {
                <p><strong>بازخورد:</strong> {{ progress.latestSubmission?.feedback }}</p>
              }
            </div>
          }

          <button type="button" class="btn-primary" (click)="startRecording.emit(assignment)">
            شروع ضبط صدا
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-assignment-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAssignmentModalComponent {
  @Input({ required: true }) assignment!: Assignment;
  @Input() progress: StudentAssignmentGateState | null = null;
  @Input() primaryInstructionAudioUrl: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() startRecording = new EventEmitter<Assignment>();

  getAttachmentIcon(kind: string): string {
    switch (kind) {
      case 'audio':
        return 'bi-file-earmark-audio';
      case 'document':
        return 'bi-file-earmark-text';
      case 'image':
        return 'bi-file-earmark-image';
      default:
        return 'bi-file-earmark';
    }
  }

  resolveAttachmentUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }
}
