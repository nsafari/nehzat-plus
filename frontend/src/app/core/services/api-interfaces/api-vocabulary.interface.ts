import { Observable } from 'rxjs';
import { VocabularyTextDto } from '../../models/lesson-planner.models';
import { VocabularyWordDto } from '../../models/lesson-planner.models';
import { UserVocabularyCardDto } from '../../models/lesson-planner.models';

export interface VocabularyApi {
  getVocabularyTexts(language?: string, isPublished?: boolean): Observable<VocabularyTextDto[]>;
  getVocabularyTextById(textId: number): Observable<VocabularyTextDto>;
  createVocabularyText(payload: any): Observable<VocabularyTextDto>;
  updateVocabularyText(textId: number, payload: any): Observable<VocabularyTextDto>;
  deleteVocabularyText(textId: number): Observable<any>;

  getVocabularyWordsByText(textId: number): Observable<VocabularyWordDto[]>;
  getVocabularyWordById(wordId: number): Observable<VocabularyWordDto>;
  createVocabularyWord(payload: any): Observable<VocabularyWordDto>;
  updateVocabularyWord(wordId: number, payload: any): Observable<VocabularyWordDto>;
  deleteVocabularyWord(wordId: number): Observable<any>;

  getDueVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]>;
  getLearningVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]>;
  getReviewVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]>;
  reviewVocabularyCard(cardId: number, quality: number): Observable<UserVocabularyCardDto>;
  searchVocabularyCards(query: string, userId: number): Observable<UserVocabularyCardDto[]>;

  getVocabularyEaseFactorInfo(userId: number): Observable<any>;
}