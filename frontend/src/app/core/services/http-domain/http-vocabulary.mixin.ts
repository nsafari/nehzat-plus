import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VocabularyTextDto } from '../../models/lesson-planner.models';
import { VocabularyWordDto } from '../../models/lesson-planner.models';
import { UserVocabularyCardDto } from '../../models/lesson-planner.models';

export function WithVocabulary<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    // Vocabulary Text endpoints
    getVocabularyTexts(language?: string, isPublished?: boolean): Observable<VocabularyTextDto[]> {
      let url = this.url('/vocabulary/texts');
      if (language) url += `?language=${language}`;
      if (isPublished !== undefined) url += `${language ? '&' : '?'}isPublished=${isPublished}`;
      return this.http.get<VocabularyTextDto[]>(url).pipe(
        map(response => response as VocabularyTextDto[])
      );
    }

    getVocabularyTextById(textId: number): Observable<VocabularyTextDto> {
      return this.http.get<VocabularyTextDto>(this.url(`/vocabulary/texts/${textId}`));
    }

    createVocabularyText(payload: any): Observable<VocabularyTextDto> {
      return this.http.post<VocabularyTextDto>(this.url('/vocabulary/texts'), payload);
    }

    updateVocabularyText(textId: number, payload: any): Observable<VocabularyTextDto> {
      return this.http.put<VocabularyTextDto>(this.url(`/vocabulary/texts/${textId}`), payload);
    }

    deleteVocabularyText(textId: number): Observable<any> {
      return this.http.delete(this.url(`/vocabulary/texts/${textId}`));
    }

    // Vocabulary Word endpoints
    getVocabularyWordsByText(textId: number): Observable<VocabularyWordDto[]> {
      return this.http.get<VocabularyWordDto[]>(this.url(`/vocabulary/words/text/${textId}`));
    }

    getVocabularyWordById(wordId: number): Observable<VocabularyWordDto> {
      return this.http.get<VocabularyWordDto>(this.url(`/vocabulary/words/${wordId}`));
    }

    createVocabularyWord(payload: any): Observable<VocabularyWordDto> {
      return this.http.post<VocabularyWordDto>(this.url('/vocabulary/words'), payload);
    }

    updateVocabularyWord(wordId: number, payload: any): Observable<VocabularyWordDto> {
      return this.http.put<VocabularyWordDto>(this.url(`/vocabulary/words/${wordId}`), payload);
    }

    deleteVocabularyWord(wordId: number): Observable<any> {
      return this.http.delete(this.url(`/vocabulary/words/${wordId}`));
    }

    // User Vocabulary Card endpoints
    getDueVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.http.get<UserVocabularyCardDto[]>(this.url(`/vocabulary/cards/due?userId=${userId}`));
    }

    getLearningVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.http.get<UserVocabularyCardDto[]>(this.url(`/vocabulary/cards/learning?userId=${userId}`));
    }

    getReviewVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.http.get<UserVocabularyCardDto[]>(this.url(`/vocabulary/cards/review?userId=${userId}`));
    }

    reviewVocabularyCard(cardId: number, quality: number): Observable<UserVocabularyCardDto> {
      return this.http.put<UserVocabularyCardDto>(this.url(`/vocabulary/cards/${cardId}/review`), { quality });
    }

    searchVocabularyCards(query: string, userId: number): Observable<UserVocabularyCardDto[]> {
      return this.http.get<UserVocabularyCardDto[]>(this.url(`/vocabulary/cards/search?query=${query}&userId=${userId}`));
    }

    getVocabularyEaseFactorInfo(userId: number): Observable<any> {
      return this.http.get(this.url(`/vocabulary/ease-factor?userId=${userId}`));
    }
  };
}