import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuranRingService } from '../../../core/services/quran-ring.service';
import {
  QuranAssetEvaluationDto,
  CreateAssetEvaluationRequest,
  EvaluationFilterDto,
  SpeedCategoryType,
} from '../../../core/models/quran-ring.models';

type ScoreKey =
  | 'memorization'
  | 'phoneticSkill'
  | 'linguisticFoundation'
  | 'semanticComprehension'
  | 'tadabborWriting'
  | 'dailyThroughput'
  | 'environmentalSupport'
  | 'motivationIdentity';

interface DimensionDef {
  key: ScoreKey;
  label: string;
  scoreField: keyof CreateAssetEvaluationRequest & string;
  notesField: string;
}

@Component({
  selector: 'app-asset-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">ارزیابی دارایی متربی</h1>
        <button class="btn btn-primary" (click)="toggleForm()">
          {{ showForm ? 'انصراف' : '+ ارزیابی جدید' }}
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">در حال بارگذاری...</div>

      <!-- Empty State -->
      <div *ngIf="!loading && !latestEvaluation && evaluations.length === 0 && !showForm" class="empty-state">
        <p>هنوز ارزیابیی ثبت نشده است.</p>
        <button class="btn btn-primary" (click)="toggleForm()">ارزیابی جدید</button>
      </div>

      <!-- Evaluation Form -->
      <div *ngIf="showForm" class="card form-card">
        <div class="card-header">
          <h2 class="card-title">فرم ارزیابی ۸ بّعدی</h2>
          <span class="form-date">{{ todayDate }}</span>
        </div>
        <div class="card-body">
          <div class="dimension-grid">
            <div *ngFor="let dim of dimensions" class="dimension-form-card">
              <div class="dim-header">
                <span class="dim-label">{{ dim.label }}</span>
                <span class="dim-score-display" [style.color]="getScoreColor(getFormScore(dim.key))">
                  {{ getFormScore(dim.key) }} / 10
                </span>
              </div>
              <div class="score-slider-row">
                <input type="range" class="score-slider" min="1" max="10" step="1"
                  [ngModel]="getFormScore(dim.key)"
                  (ngModelChange)="setFormScore(dim.key, $event)" />
                <div class="score-bar-track">
                  <div class="score-bar-fill"
                    [style.width.%]="getFormScore(dim.key) * 10"
                    [style.background]="getScoreColor(getFormScore(dim.key))"></div>
                </div>
              </div>
              <textarea class="form-textarea"
                [ngModel]="getFormNotes(dim.key)"
                (ngModelChange)="setFormNotes(dim.key, $event)"
                [placeholder]="'توضیحات ' + dim.label + '...'"
                rows="2"></textarea>
            </div>
          </div>

          <!-- Total Score & Speed Category -->
          <div class="form-footer">
            <div class="total-score-section">
              <span class="total-label">نمره کل:</span>
              <span class="total-value" [style.color]="getScoreColor(form.totalScore / 8)">
                {{ form.totalScore }} / 80
              </span>
              <div class="total-bar">
                <div class="total-bar-fill"
                  [style.width.%]="(form.totalScore / 80) * 100"
                  [style.background]="getScoreColor(form.totalScore / 8)"></div>
              </div>
            </div>
            <div class="speed-section">
              <label class="form-label">دسته سرعت پیشنهادی</label>
              <select class="form-select" [(ngModel)]="form.suggestedSpeedCategory">
                <option *ngFor="let opt of speedOptions" [ngValue]="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div class="general-notes-section">
              <label class="form-label">توضیحات کلی</label>
              <textarea class="form-textarea" [(ngModel)]="form.generalNotes"
                placeholder="توضیحات کلی ارزیابی..." rows="3"></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" (click)="submit()" [disabled]="submitting || !isFormValid()">
              {{ submitting ? 'در حال ثبت...' : 'ثبت ارزیابی' }}
            </button>
            <button class="btn btn-secondary" (click)="toggleForm()">انصراف</button>
            <span *ngIf="submitError" class="error-text">{{ submitError }}</span>
          </div>
        </div>
      </div>

      <!-- Latest Evaluation Card -->
      <div *ngIf="latestEvaluation && !showForm" class="card latest-card">
        <div class="card-header">
          <h2 class="card-title">آخرین ارزیابی</h2>
          <div class="header-meta">
            <span class="date-badge">{{ formatDate(latestEvaluation.evaluationDate) }}</span>
            <span class="speed-badge" [ngClass]="'speed-' + latestEvaluation.suggestedSpeedCategory">
              {{ getSpeedLabel(latestEvaluation.suggestedSpeedCategory) }}
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="dimension-grid">
            <div *ngFor="let dim of dimensions" class="dimension-card">
              <div class="dim-header">
                <span class="dim-label">{{ dim.label }}</span>
                <span class="dim-score" [style.color]="getScoreColor(getEvalScore(latestEvaluation, dim.key))">
                  {{ getEvalScore(latestEvaluation, dim.key) }} / 10
                </span>
              </div>
              <div class="score-bar-track">
                <div class="score-bar-fill"
                  [style.width.%]="getEvalScore(latestEvaluation, dim.key) * 10"
                  [style.background]="getScoreColor(getEvalScore(latestEvaluation, dim.key))"></div>
              </div>
              <p *ngIf="getEvalNotes(latestEvaluation, dim.key)" class="dim-notes">
                {{ getEvalNotes(latestEvaluation, dim.key) }}
              </p>
            </div>
          </div>

          <div class="latest-total">
            <span class="total-label">نمره کل:</span>
            <span class="total-value" [style.color]="getScoreColor(latestEvaluation.totalScore / 8)">
              {{ latestEvaluation.totalScore }} / 80
            </span>
            <div class="total-bar">
              <div class="total-bar-fill"
                [style.width.%]="(latestEvaluation.totalScore / 80) * 100"
                [style.background]="getScoreColor(latestEvaluation.totalScore / 8)"></div>
            </div>
          </div>

          <p *ngIf="latestEvaluation.generalNotes" class="general-notes">
            <strong>توضیحات کلی:</strong> {{ latestEvaluation.generalNotes }}
          </p>
        </div>
      </div>

      <!-- Evaluation History -->
      <div *ngIf="evaluations.length > 0 && !showForm" class="card history-card">
        <div class="card-header">
          <h2 class="card-title">تاریخشه ارزیابی‌ها</h2>
          <span class="count-badge">{{ evaluations.length }} مورد</span>
        </div>
        <div class="card-body">
          <div class="history-list">
            <div *ngFor="let ev of evaluations; let i = index" class="history-item"
              [class.expanded]="expandedIndex === i">
              <div class="history-row" (click)="toggleExpand(i)">
                <div class="history-main">
                  <span class="history-date">{{ formatDate(ev.evaluationDate) }}</span>
                  <span class="history-score" [style.color]="getScoreColor(ev.totalScore / 8)">
                    {{ ev.totalScore }} / 80
                  </span>
                  <div class="history-mini-bar">
                    <div class="mini-bar-fill"
                      [style.width.%]="(ev.totalScore / 80) * 100"
                      [style.background]="getScoreColor(ev.totalScore / 8)"></div>
                  </div>
                  <span class="speed-badge small" [ngClass]="'speed-' + ev.suggestedSpeedCategory">
                    {{ getSpeedLabel(ev.suggestedSpeedCategory) }}
                  </span>
                </div>
                <span class="expand-icon" [class.rotated]="expandedIndex === i">▼</span>
              </div>
              <div *ngIf="expandedIndex === i" class="history-details">
                <div class="detail-grid">
                  <div *ngFor="let dim of dimensions" class="detail-item">
                    <span class="detail-label">{{ dim.label }}</span>
                    <span class="detail-score" [style.color]="getScoreColor(getEvalScore(ev, dim.key))">
                      {{ getEvalScore(ev, dim.key) }}/10
                    </span>
                    <span *ngIf="getEvalNotes(ev, dim.key)" class="detail-notes">{{ getEvalNotes(ev, dim.key) }}</span>
                  </div>
                </div>
                <p *ngIf="ev.generalNotes" class="detail-general">
                  <strong>توضیحات کلی:</strong> {{ ev.generalNotes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  styles: [`    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; color: var(--lp-text-primary, #1e293b); margin: 0; }
    .card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; margin-bottom: 1.5rem; overflow: hidden; }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--lp-border, #e2e8f0); flex-wrap: wrap; gap: 0.5rem; }
    .card-title { font-size: 1.125rem; font-weight: 600; color: var(--lp-text-primary, #1e293b); margin: 0; }
    .card-body { padding: 1.25rem; }
    .header-meta { display: flex; align-items: center; gap: 0.75rem; }

    /* Loading & Empty */
    .loading-state, .empty-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary, #64748b); }
    .empty-state p { margin-bottom: 1rem; font-size: 1rem; }

    /* Buttons */
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
    .btn-primary { background: var(--lp-primary, #2563eb); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark, #1d4ed8); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: var(--lp-secondary, #64748b); color: #fff; }
    .btn-secondary:hover:not(:disabled) { background: var(--lp-secondary-dark, #475569); }
    .form-actions { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--lp-border, #e2e8f0); }
    .error-text { color: var(--lp-danger, #dc2626); font-size: 0.875rem; }

    /* Dimension Grid (2-column) */
    .dimension-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .dimension-card, .dimension-form-card { background: var(--lp-card-bg, #fff); border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; padding: 1rem; }
    .dim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .dim-label { font-weight: 600; font-size: 0.875rem; color: var(--lp-text-primary, #1e293b); }
    .dim-score, .dim-score-display { font-size: 0.875rem; font-weight: 600; }
    .dim-notes { font-size: 0.8125rem; color: var(--lp-text-secondary, #64748b); margin: 0.5rem 0 0; }

    /* Score Bar */
    .score-bar-track { background: var(--lp-muted-bg, #f1f5f9); border-radius: 9999px; height: 8px; overflow: hidden; margin: 0.5rem 0; }
    .score-bar-fill { height: 100%; border-radius: 9999px; transition: width 0.3s, background 0.3s; }

    /* Slider */
    .score-slider-row { display: flex; flex-direction: column; gap: 0.25rem; }
    .score-slider { width: 100%; accent-color: var(--lp-primary, #2563eb); }

    /* Form textarea & select */
    .form-textarea { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--lp-border, #e2e8f0); border-radius: 6px; font-size: 0.8125rem; resize: vertical; font-family: inherit; background: var(--lp-input-bg, #fff); color: var(--lp-text-primary, #1e293b); margin-top: 0.5rem; }
    .form-textarea:focus { outline: none; border-color: var(--lp-primary, #2563eb); box-shadow: 0 0 0 3px var(--lp-primary-light, #dbeafe); }
    .form-label { display: block; font-weight: 500; font-size: 0.875rem; color: var(--lp-text-primary, #1e293b); margin-bottom: 0.375rem; }
    .form-select { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--lp-border, #e2e8f0); border-radius: 6px; font-size: 0.875rem; background: var(--lp-input-bg, #fff); color: var(--lp-text-primary, #1e293b); }
    .form-date { font-size: 0.8125rem; color: var(--lp-text-secondary, #64748b); }

    /* Form Footer */
    .form-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--lp-border, #e2e8f0); }
    .total-score-section { grid-column: 1 / -1; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .total-label { font-weight: 600; font-size: 0.9375rem; color: var(--lp-text-primary, #1e293b); }
    .total-value { font-size: 1.25rem; font-weight: 700; }
    .total-bar { flex: 1; min-width: 200px; background: var(--lp-muted-bg, #f1f5f9); border-radius: 9999px; height: 12px; overflow: hidden; }
    .total-bar-fill { height: 100%; border-radius: 9999px; transition: width 0.3s, background 0.3s; }
    .speed-section, .general-notes-section { display: flex; flex-direction: column; }

    /* Latest Evaluation */
    .latest-total { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--lp-border, #e2e8f0); flex-wrap: wrap; }
    .general-notes { font-size: 0.875rem; color: var(--lp-text-secondary, #64748b); margin: 1rem 0 0; }

    /* Speed Badge */
    .speed-badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; white-space: nowrap; }
    .speed-badge.small { font-size: 0.6875rem; padding: 0.125rem 0.5rem; }
    .speed-STAMINA { background: var(--lp-success-light, #dcfce7); color: var(--lp-success, #166534); }
    .speed-SEMI_SPEED { background: var(--lp-warning-light, #fef3c7); color: var(--lp-warning, #92400e); }
    .speed-SPEED { background: var(--lp-danger-light, #fee2e2); color: var(--lp-danger, #991b1b); }
    .speed-POINT_MEMORIZATION { background: var(--lp-info-light, #dbeafe); color: var(--lp-info, #1e40af); }
    .date-badge { font-size: 0.8125rem; color: var(--lp-text-secondary, #64748b); }
    .count-badge { font-size: 0.8125rem; color: var(--lp-text-secondary, #64748b); background: var(--lp-muted-bg, #f1f5f9); padding: 0.125rem 0.5rem; border-radius: 4px; }

    /* History */
    .history-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .history-item { border: 1px solid var(--lp-border, #e2e8f0); border-radius: 8px; overflow: hidden; }
    .history-item.expanded { border-color: var(--lp-primary, #2563eb); }
    .history-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; cursor: pointer; transition: background 0.15s; }
    .history-row:hover { background: var(--lp-muted-bg, #f1f5f9); }
    .history-main { display: flex; align-items: center; gap: 1rem; flex: 1; flex-wrap: wrap; }
    .history-date { font-size: 0.875rem; color: var(--lp-text-primary, #1e293b); font-weight: 500; min-width: 100px; }
    .history-score { font-size: 0.9375rem; font-weight: 600; }
    .history-mini-bar { width: 80px; background: var(--lp-muted-bg, #f1f5f9); border-radius: 9999px; height: 6px; overflow: hidden; }
    .mini-bar-fill { height: 100%; border-radius: 9999px; }
    .expand-icon { font-size: 0.75rem; color: var(--lp-text-secondary, #64748b); transition: transform 0.2s; }
    .expand-icon.rotated { transform: rotate(180deg); }

    /* History Details */
    .history-details { padding: 1rem; border-top: 1px solid var(--lp-border, #e2e8f0); background: var(--lp-muted-bg, #f8fafc); }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.125rem; }
    .detail-label { font-size: 0.8125rem; font-weight: 500; color: var(--lp-text-secondary, #64748b); }
    .detail-score { font-size: 0.875rem; font-weight: 600; }
    .detail-notes { font-size: 0.75rem; color: var(--lp-text-secondary, #64748b); }
    .detail-general { font-size: 0.875rem; color: var(--lp-text-secondary, #64748b); margin: 1rem 0 0; }`]
})
export class AssetEvaluationComponent implements OnInit {
  private quranRingService = inject(QuranRingService);

  @Input() studentId!: number;
  @Input() ringId!: number;
  @Input() evaluatorUserId!: number;

  latestEvaluation: QuranAssetEvaluationDto | null = null;
  evaluations: QuranAssetEvaluationDto[] = [];
  showForm = false;
  loading = false;
  submitting = false;
  submitError = '';
  expandedIndex: number | null = null;
  todayDate = new Date().toISOString().split('T')[0];

  dimensions: DimensionDef[] = [
    { key: 'memorization', label: 'حفظ', scoreField: 'memorizationScore', notesField: 'memorizationNotes' },
    { key: 'phoneticSkill', label: 'مهارت لفظی', scoreField: 'phoneticSkillScore', notesField: 'phoneticSkillNotes' },
    { key: 'linguisticFoundation', label: 'زیرسازی لغوی', scoreField: 'linguisticFoundationScore', notesField: 'linguisticFoundationNotes' },
    { key: 'semanticComprehension', label: 'درک معنایی', scoreField: 'semanticComprehensionScore', notesField: 'semanticComprehensionNotes' },
    { key: 'tadabborWriting', label: 'تدبر و نگارش', scoreField: 'tadabborWritingScore', notesField: 'tadabborWritingNotes' },
    { key: 'dailyThroughput', label: 'تولید روزانه', scoreField: 'dailyThroughputScore', notesField: 'dailyThroughputNotes' },
    { key: 'environmentalSupport', label: 'حمایت محیطی', scoreField: 'environmentalSupportScore', notesField: 'environmentalSupportNotes' },
    { key: 'motivationIdentity', label: 'انگیزه و هویت', scoreField: 'motivationIdentityScore', notesField: 'motivationIdentityNotes' },
  ];

  form = {
    memorizationScore: 5, memorizationNotes: '',
    phoneticSkillScore: 5, phoneticSkillNotes: '',
    linguisticFoundationScore: 5, linguisticFoundationNotes: '',
    semanticComprehensionScore: 5, semanticComprehensionNotes: '',
    tadabborWritingScore: 5, tadabborWritingNotes: '',
    dailyThroughputScore: 5, dailyThroughputNotes: '',
    environmentalSupportScore: 5, environmentalSupportNotes: '',
    motivationIdentityScore: 5, motivationIdentityNotes: '',
    totalScore: 40,
    suggestedSpeedCategory: 'STAMINA' as SpeedCategoryType,
    generalNotes: ''
  };

  speedOptions: { value: SpeedCategoryType; label: string }[] = [
    { value: 'STAMINA', label: 'استقامتی (پایه)' },
    { value: 'SEMI_SPEED', label: 'نیمه‌سرعتی' },
    { value: 'SPEED', label: 'سرعتی' },
    { value: 'POINT_MEMORIZATION', label: 'حفظ نقطه‌ای' },
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!this.studentId || !this.ringId) return;
    this.loading = true;
    const filter: EvaluationFilterDto = { studentId: this.studentId, ringId: this.ringId };
    this.quranRingService.getAssetEvaluations(filter).subscribe({
      next: (data) => { this.evaluations = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.quranRingService.getLatestEvaluation(this.studentId, this.ringId).subscribe({
      next: (ev) => { this.latestEvaluation = ev; },
      error: () => {}
    });
  }

  // --- Form score helpers ---
  getFormScore(key: ScoreKey): number {
    const map: Record<ScoreKey, number> = {
      memorization: this.form.memorizationScore,
      phoneticSkill: this.form.phoneticSkillScore,
      linguisticFoundation: this.form.linguisticFoundationScore,
      semanticComprehension: this.form.semanticComprehensionScore,
      tadabborWriting: this.form.tadabborWritingScore,
      dailyThroughput: this.form.dailyThroughputScore,
      environmentalSupport: this.form.environmentalSupportScore,
      motivationIdentity: this.form.motivationIdentityScore,
    };
    return map[key];
  }

  setFormScore(key: ScoreKey, value: number): void {
    const clamp = Math.max(1, Math.min(10, Math.round(value)));
    switch (key) {
      case 'memorization': this.form.memorizationScore = clamp; break;
      case 'phoneticSkill': this.form.phoneticSkillScore = clamp; break;
      case 'linguisticFoundation': this.form.linguisticFoundationScore = clamp; break;
      case 'semanticComprehension': this.form.semanticComprehensionScore = clamp; break;
      case 'tadabborWriting': this.form.tadabborWritingScore = clamp; break;
      case 'dailyThroughput': this.form.dailyThroughputScore = clamp; break;
      case 'environmentalSupport': this.form.environmentalSupportScore = clamp; break;
      case 'motivationIdentity': this.form.motivationIdentityScore = clamp; break;
    }
    this.calculateTotal();
  }

  getFormNotes(key: ScoreKey): string {
    const map: Record<ScoreKey, string> = {
      memorization: this.form.memorizationNotes,
      phoneticSkill: this.form.phoneticSkillNotes,
      linguisticFoundation: this.form.linguisticFoundationNotes,
      semanticComprehension: this.form.semanticComprehensionNotes,
      tadabborWriting: this.form.tadabborWritingNotes,
      dailyThroughput: this.form.dailyThroughputNotes,
      environmentalSupport: this.form.environmentalSupportNotes,
      motivationIdentity: this.form.motivationIdentityNotes,
    };
    return map[key];
  }

  setFormNotes(key: ScoreKey, value: string): void {
    switch (key) {
      case 'memorization': this.form.memorizationNotes = value; break;
      case 'phoneticSkill': this.form.phoneticSkillNotes = value; break;
      case 'linguisticFoundation': this.form.linguisticFoundationNotes = value; break;
      case 'semanticComprehension': this.form.semanticComprehensionNotes = value; break;
      case 'tadabborWriting': this.form.tadabborWritingNotes = value; break;
      case 'dailyThroughput': this.form.dailyThroughputNotes = value; break;
      case 'environmentalSupport': this.form.environmentalSupportNotes = value; break;
      case 'motivationIdentity': this.form.motivationIdentityNotes = value; break;
    }
  }

  // --- Evaluation score helpers ---
  getEvalScore(ev: QuranAssetEvaluationDto, key: ScoreKey): number {
    const map: Record<ScoreKey, number> = {
      memorization: ev.memorizationScore,
      phoneticSkill: ev.phoneticSkillScore,
      linguisticFoundation: ev.linguisticFoundationScore,
      semanticComprehension: ev.semanticComprehensionScore,
      tadabborWriting: ev.tadabborWritingScore,
      dailyThroughput: ev.dailyThroughputScore,
      environmentalSupport: ev.environmentalSupportScore,
      motivationIdentity: ev.motivationIdentityScore,
    };
    return map[key];
  }

  getEvalNotes(ev: QuranAssetEvaluationDto, key: ScoreKey): string {
    const map: Record<ScoreKey, string | undefined> = {
      memorization: ev.memorizationNotes,
      phoneticSkill: ev.phoneticSkillNotes,
      linguisticFoundation: ev.linguisticFoundationNotes,
      semanticComprehension: ev.semanticComprehensionNotes,
      tadabborWriting: ev.tadabborWritingNotes,
      dailyThroughput: ev.dailyThroughputNotes,
      environmentalSupport: ev.environmentalSupportNotes,
      motivationIdentity: ev.motivationIdentityNotes,
    };
    return map[key] || '';
  }

  // --- Score color ---
  getScoreColor(score: number): string {
    if (score >= 7) return 'var(--lp-success, #166534)';
    if (score >= 4) return 'var(--lp-warning, #92400e)';
    return 'var(--lp-danger, #991b1b)';
  }

  // --- Total calculation ---
  calculateTotal(): void {
    this.form.totalScore =
      this.form.memorizationScore + this.form.phoneticSkillScore +
      this.form.linguisticFoundationScore + this.form.semanticComprehensionScore +
      this.form.tadabborWritingScore + this.form.dailyThroughputScore +
      this.form.environmentalSupportScore + this.form.motivationIdentityScore;
  }

  // --- Form validation ---
  isFormValid(): boolean {
    return this.form.totalScore > 0 && this.form.totalScore <= 80;
  }

  // --- Submit ---
  submit(): void {
    if (!this.isFormValid()) return;
    this.submitting = true;
    this.submitError = '';
    const req: CreateAssetEvaluationRequest = {
      studentId: this.studentId,
      ringId: this.ringId,
      evaluatorUserId: this.evaluatorUserId,
      evaluationDate: this.todayDate,
      memorizationScore: this.form.memorizationScore,
      memorizationNotes: this.form.memorizationNotes || undefined,
      phoneticSkillScore: this.form.phoneticSkillScore,
      phoneticSkillNotes: this.form.phoneticSkillNotes || undefined,
      linguisticFoundationScore: this.form.linguisticFoundationScore,
      linguisticFoundationNotes: this.form.linguisticFoundationNotes || undefined,
      semanticComprehensionScore: this.form.semanticComprehensionScore,
      semanticComprehensionNotes: this.form.semanticComprehensionNotes || undefined,
      tadabborWritingScore: this.form.tadabborWritingScore,
      tadabborWritingNotes: this.form.tadabborWritingNotes || undefined,
      dailyThroughputScore: this.form.dailyThroughputScore,
      dailyThroughputNotes: this.form.dailyThroughputNotes || undefined,
      environmentalSupportScore: this.form.environmentalSupportScore,
      environmentalSupportNotes: this.form.environmentalSupportNotes || undefined,
      motivationIdentityScore: this.form.motivationIdentityScore,
      motivationIdentityNotes: this.form.motivationIdentityNotes || undefined,
      totalScore: this.form.totalScore,
      suggestedSpeedCategory: this.form.suggestedSpeedCategory,
      generalNotes: this.form.generalNotes || undefined,
    };
    this.quranRingService.createAssetEvaluation(req).subscribe({
      next: (ev) => {
        this.latestEvaluation = ev;
        this.evaluations.unshift(ev);
        this.showForm = false;
        this.submitting = false;
        this.resetForm();
      },
      error: (err) => {
        this.submitError = err.error?.message || 'خطا در ثبت ارزیابی';
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.form = {
      memorizationScore: 5, memorizationNotes: '',
      phoneticSkillScore: 5, phoneticSkillNotes: '',
      linguisticFoundationScore: 5, linguisticFoundationNotes: '',
      semanticComprehensionScore: 5, semanticComprehensionNotes: '',
      tadabborWritingScore: 5, tadabborWritingNotes: '',
      dailyThroughputScore: 5, dailyThroughputNotes: '',
      environmentalSupportScore: 5, environmentalSupportNotes: '',
      motivationIdentityScore: 5, motivationIdentityNotes: '',
      totalScore: 40,
      suggestedSpeedCategory: 'STAMINA' as SpeedCategoryType,
      generalNotes: ''
    };
  }

  // --- UI helpers ---
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.submitError = '';
  }

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  getSpeedLabel(category: SpeedCategoryType): string {
    const map: Record<SpeedCategoryType, string> = {
      STAMINA: 'استقامتی',
      SEMI_SPEED: 'نیمه‌سرعتی',
      SPEED: 'سرعتی',
      POINT_MEMORIZATION: 'حفظ نقطه‌ای',
    };
    return map[category] || category;
  }
}