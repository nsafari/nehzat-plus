import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VocabularyTextDto } from '../models/lesson-planner.models';
import { VocabularyWordDto } from '../models/lesson-planner.models';
import { UserVocabularyCardDto } from '../models/lesson-planner.models';

/**
 * Vocabulary delegation - provides mock implementations for vocabulary API methods.
 * All methods return observables with delay for realistic async behavior.
 */
export function withVocabulary<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // Vocabulary Text mock implementations
    getVocabularyTexts(language?: string, isPublished?: boolean): Observable<VocabularyTextDto[]> {
      return this.vocabulary.getVocabularyTexts(language, isPublished);
    }

    getVocabularyTextById(textId: number): Observable<VocabularyTextDto> {
      return this.vocabulary.getVocabularyTextById(textId);
    }

    createVocabularyText(payload: any): Observable<VocabularyTextDto> {
      return this.vocabulary.createVocabularyText(payload);
    }

    updateVocabularyText(textId: number, payload: any): Observable<VocabularyTextDto> {
      return this.vocabulary.updateVocabularyText(textId, payload);
    }

    deleteVocabularyText(textId: number): Observable<any> {
      return this.vocabulary.deleteVocabularyText(textId);
    }

    // Vocabulary Word mock implementations
    getVocabularyWordsByText(textId: number): Observable<VocabularyWordDto[]> {
      return this.vocabulary.getVocabularyWordsByText(textId);
    }

    getVocabularyWordById(wordId: number): Observable<VocabularyWordDto> {
      return this.vocabulary.getVocabularyWordById(wordId);
    }

    createVocabularyWord(payload: any): Observable<VocabularyWordDto> {
      return this.vocabulary.createVocabularyWord(payload);
    }

    updateVocabularyWord(wordId: number, payload: any): Observable<VocabularyWordDto> {
      return this.vocabulary.updateVocabularyWord(wordId, payload);
    }

    deleteVocabularyWord(wordId: number): Observable<any> {
      return this.vocabulary.deleteVocabularyWord(wordId);
    }

    // User Vocabulary Card mock implementations
    getDueVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.vocabulary.getDueVocabularyCards(userId);
    }

    getLearningVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.vocabulary.getLearningVocabularyCards(userId);
    }

    getReviewVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
      return this.vocabulary.getReviewVocabularyCards(userId);
    }

    reviewVocabularyCard(cardId: number, quality: number): Observable<UserVocabularyCardDto> {
      return this.vocabulary.reviewVocabularyCard(cardId, quality);
    }

    searchVocabularyCards(query: string, userId: number): Observable<UserVocabularyCardDto[]> {
      return this.vocabulary.searchVocabularyCards(query, userId);
    }

    getVocabularyEaseFactorInfo(userId: number): Observable<any> {
      return this.vocabulary.getVocabularyEaseFactorInfo(userId);
    }
  };
}