import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { UserVocabularyCardDto } from '../../models/lesson-planner.models';
import { VocabularyTextDto } from '../../models/lesson-planner.models';
import { VocabularyWordDto } from '../../models/lesson-planner.models';

/**
 * Mock vocabulary service that provides mock data for vocabulary API methods.
 */
@Injectable({ providedIn: 'root' })
export class MockVocabularyService {
  // Sample vocabulary data for mock
  private mockTexts: VocabularyTextDto[] = [
    {
      id: 1,
      title: 'درس اول: آداب Alberta',
      description: 'متن آموزشی اول',
      content: 'این محتوا.coursework است',
      language: 'fa',
      subjectAreaId: 1,
      ownerUserId: 'admin',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private mockWords: VocabularyWordDto[] = [
    {
      id: 1,
      wordText: 'لمی',
      definition: 'کلمه معروف',
      exampleSentence: 'این جمله مثال است',
      exampleTranslation: 'This is an example sentence',
      partOfSpeech: 'اسم',
      imageUrl: null,
      audioUrl: null,
      difficultyLevel: 'basic',
      vocabularyTextId: 1,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private mockCards: UserVocabularyCardDto[] = [
    {
      id: 1,
      userId: 'user1',
      vocabularyWordId: 1,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      interval: 1,
      easeFactor: 2.5,
      repetition: 1,
      quality: 3,
      isKnown: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getVocabularyTexts(language?: string, isPublished?: boolean): Observable<VocabularyTextDto[]> {
    let results = [...this.mockTexts];
    if (language) {
      results = results.filter(t => t.language === language);
    }
    if (isPublished !== undefined) {
      results = results.filter(t => t.isPublished === isPublished);
    }
    return of(results).pipe(delay(300));
  }

  getVocabularyTextById(textId: number): Observable<VocabularyTextDto> {
    const text = this.mockTexts.find(t => t.id === textId);
    return of(text || {} as VocabularyTextDto).pipe(delay(300));
  }

  createVocabularyText(payload: any): Observable<VocabularyTextDto> {
    const text: VocabularyTextDto = {
      id: this.mockTexts.length + 1,
      title: payload.title,
      description: payload.description,
      content: payload.content,
      language: payload.language,
      subjectAreaId: payload.subjectAreaId,
      ownerUserId: payload.ownerUserId,
      isPublished: payload.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockTexts.push(text);
    return of(text).pipe(delay(300));
  }

  updateVocabularyText(textId: number, payload: any): Observable<VocabularyTextDto> {
    const index = this.mockTexts.findIndex(t => t.id === textId);
    if (index >= 0) {
      const updated: VocabularyTextDto = {
        ...this.mockTexts[index],
        title: payload.title,
        description: payload.description,
        content: payload.content,
        language: payload.language,
        isPublished: payload.isPublished,
        updatedAt: new Date().toISOString(),
      };
      this.mockTexts[index] = updated;
      return of(updated).pipe(delay(300));
    }
    return of({} as VocabularyTextDto).pipe(delay(300));
  }

  deleteVocabularyText(textId: number): Observable<any> {
    const index = this.mockTexts.findIndex(t => t.id === textId);
    if (index >= 0) {
      this.mockTexts.splice(index, 1);
    }
    return of({}).pipe(delay(300));
  }

  getVocabularyWordsByText(textId: number): Observable<VocabularyWordDto[]> {
    const words = this.mockWords.filter(w => w.vocabularyTextId === textId);
    return of(words).pipe(delay(300));
  }

  getVocabularyWordById(wordId: number): Observable<VocabularyWordDto> {
    const word = this.mockWords.find(w => w.id === wordId);
    return of(word || {} as VocabularyWordDto).pipe(delay(300));
  }

  createVocabularyWord(payload: any): Observable<VocabularyWordDto> {
    const word: VocabularyWordDto = {
      id: this.mockWords.length + 1,
      wordText: payload.wordText,
      definition: payload.definition,
      exampleSentence: payload.exampleSentence,
      exampleTranslation: payload.exampleTranslation,
      partOfSpeech: payload.partOfSpeech,
      imageUrl: payload.imageUrl,
      audioUrl: payload.audioUrl,
      difficultyLevel: payload.difficultyLevel ?? 'basic',
      vocabularyTextId: payload.vocabularyTextId,
      displayOrder: payload.displayOrder ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockWords.push(word);
    return of(word).pipe(delay(300));
  }

  updateVocabularyWord(wordId: number, payload: any): Observable<VocabularyWordDto> {
    const index = this.mockWords.findIndex(w => w.id === wordId);
    if (index >= 0) {
      const updated: VocabularyWordDto = {
        ...this.mockWords[index],
        wordText: payload.wordText,
        definition: payload.definition,
        exampleSentence: payload.exampleSentence,
        exampleTranslation: payload.exampleTranslation,
        partOfSpeech: payload.partOfSpeech,
        imageUrl: payload.imageUrl,
        audioUrl: payload.audioUrl,
        difficultyLevel: payload.difficultyLevel,
        vocabularyTextId: payload.vocabularyTextId,
        displayOrder: payload.displayOrder,
        updatedAt: new Date().toISOString(),
      };
      this.mockWords[index] = updated;
      return of(updated).pipe(delay(300));
    }
    return of({} as VocabularyWordDto).pipe(delay(300));
  }

  deleteVocabularyWord(wordId: number): Observable<any> {
    const index = this.mockWords.findIndex(w => w.id === wordId);
    if (index >= 0) {
      this.mockWords.splice(index, 1);
    }
    return of({}).pipe(delay(300));
  }

  getDueVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
    const cards = this.mockCards.filter(c => !c.isKnown);
    return of(cards).pipe(delay(300));
  }

  getLearningVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
    const cards = this.mockCards.filter(c => !c.isKnown);
    return of(cards).pipe(delay(300));
  }

  getReviewVocabularyCards(userId: number): Observable<UserVocabularyCardDto[]> {
    const cards = this.mockCards.filter(c => !c.isKnown);
    return of(cards).pipe(delay(300));
  }

  reviewVocabularyCard(cardId: number, quality: number): Observable<UserVocabularyCardDto> {
    const index = this.mockCards.findIndex(c => c.id === cardId);
    if (index >= 0) {
      const card = this.mockCards[index];
      // Update quality and potentially interval
      const updatedQuality = Math.max(1, Math.min(4, quality));
      const updatedCard = {
        ...card,
        quality: updatedQuality,
        updatedAt: new Date().toISOString(),
      };
      this.mockCards[index] = updatedCard;
      return of(updatedCard).pipe(delay(300));
    }
    return of({} as UserVocabularyCardDto).pipe(delay(300));
  }

  searchVocabularyCards(query: string, userId: number): Observable<UserVocabularyCardDto[]> {
    const lowerQuery = query.toLowerCase();
    const cards = this.mockCards.filter(
      c => 
        c.vocabularyWord?.wordText.toLowerCase().includes(lowerQuery) ||
        c.vocabularyWord?.definition.toLowerCase().includes(lowerQuery) ||
        (c.vocabularyWord?.exampleSentence?.toLowerCase()?.includes(lowerQuery) ?? false)
    );
    return of(cards).pipe(delay(300));
  }

  getVocabularyEaseFactorInfo(userId: number): Observable<any> {
    return of({
      easeFactor: 2.5,
      minEaseFactor: 1.3,
      maxIntervalDays: 365,
      defaultInterval: 1,
    }).pipe(delay(300));
  }
}