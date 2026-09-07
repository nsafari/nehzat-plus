import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuranComTafsir } from '../../../../core/models/lesson-planner.models';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-tafsir',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './tafsir.component.html',
  styleUrls: ['./tafsir.component.scss']
})
export class TafsirComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quranService = inject(QuranService);

  tafsir = signal<QuranComTafsir | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  surahId = signal(0);
  ayahNumber = signal(0);

  ngOnInit(): void {
    const surahId = Number(this.route.snapshot.paramMap.get('surahId'));
    const ayahNumber = Number(this.route.snapshot.paramMap.get('ayahNumber'));

    this.surahId.set(surahId);
    this.ayahNumber.set(ayahNumber);

    this.quranService.getQuranTafsir(surahId, ayahNumber).subscribe({
      next: (data) => {
        this.tafsir.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tafsir:', err);
        this.error.set('خطا در بارگیری تفسیر');
        this.loading.set(false);
      }
    });
  }

  get verseKey(): string {
    const t = this.tafsir();
    return t ? t.verseKey : `${this.surahId()}:${this.ayahNumber()}`;
  }
}
