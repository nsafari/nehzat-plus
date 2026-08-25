import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuranComSearchResult } from '../../../../core/models/lesson-planner.models';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quran-search.component.html',
  styleUrls: ['./quran-search.component.scss']
})
export class QuranSearchComponent {
  private readonly quranService = inject(QuranService);

  searchQuery = '';
  results = signal<QuranComSearchResult[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searched = signal(false);

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);

    this.quranService.searchQuran(query).subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error searching Quran:', err);
        this.error.set('خطا در جستجوی قرآن');
        this.loading.set(false);
      }
    });
  }

  /** Parse verseKey "2:255" → surahId */
  getSurahId(verseKey: string): number {
    const parts = verseKey.split(':');
    return parts.length === 2 ? Number(parts[0]) : 0;
  }

  /** Parse verseKey "2:255" → ayahNumber */
  getAyahNumber(verseKey: string): number {
    const parts = verseKey.split(':');
    return parts.length === 2 ? Number(parts[1]) : 0;
  }
}
