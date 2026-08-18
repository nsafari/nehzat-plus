import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';

/**
 * Persian-literature sub-domain (poets, poems, analyses, dashboard).
 * Split from the former monolithic MockLiteratureService.
 */
export abstract class MockLiteraturePersianBaseService {
  constructor(protected ctx: MockDataContext) {}

  getPoets(difficulty?: string): Observable<any[]> {
    let poets = [...this.ctx.mockPoets];
    if (difficulty) poets = poets.filter((p: any) => p.difficulty === difficulty);
    return this.ctx.delayed(poets);
  }

  getPoetById(id: number): Observable<any> {
    const poet = this.ctx.mockPoets.find((p: any) => p.id === id);
    if (!poet) throw new Error('Poet not found');
    return this.ctx.delayed(poet);
  }

  createPoet(payload: any): Observable<any> {
    const poet = { id: this.ctx.nextId(this.ctx.mockPoets), ...payload };
    this.ctx.mockPoets.push(poet);
    return this.ctx.delayed(poet);
  }

  updatePoet(id: number, payload: any): Observable<any> {
    const poet = this.ctx.mockPoets.find((p: any) => p.id === id);
    if (!poet) throw new Error('Poet not found');
    Object.assign(poet, payload);
    return this.ctx.delayed(poet);
  }

  deletePoet(id: number): Observable<void> {
    this.ctx.mockPoets = this.ctx.mockPoets.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchPoets(query: string): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mockPoets.filter((p: any) => p.name?.includes(query)));
  }

  getPoems(poetId?: number, genre?: string, difficulty?: string): Observable<any[]> {
    let poems = [...this.ctx.mockPoems];
    if (poetId !== undefined) poems = poems.filter((p: any) => p.poetId === poetId);
    if (genre) poems = poems.filter((p: any) => p.genre === genre);
    if (difficulty) poems = poems.filter((p: any) => p.difficulty === difficulty);
    return this.ctx.delayed(poems);
  }

  getPoemById(id: number): Observable<any> {
    const poem = this.ctx.mockPoems.find((p: any) => p.id === id);
    if (!poem) throw new Error('Poem not found');
    return this.ctx.delayed(poem);
  }

  createPoem(payload: any): Observable<any> {
    const poem = { id: this.ctx.nextId(this.ctx.mockPoems), ...payload };
    this.ctx.mockPoems.push(poem);
    return this.ctx.delayed(poem);
  }

  updatePoem(id: number, payload: any): Observable<any> {
    const poem = this.ctx.mockPoems.find((p: any) => p.id === id);
    if (!poem) throw new Error('Poem not found');
    Object.assign(poem, payload);
    return this.ctx.delayed(poem);
  }

  deletePoem(id: number): Observable<void> {
    this.ctx.mockPoems = this.ctx.mockPoems.filter((p: any) => p.id !== id);
    return this.ctx.delayed(undefined);
  }

  searchPoems(query: string): Observable<any[]> {
    return this.ctx.delayed(
      this.ctx.mockPoems.filter((p: any) => p.title?.includes(query) || p.text?.includes(query)),
    );
  }

  getAnalysesByPoem(poemId: number): Observable<any[]> {
    return this.ctx.delayed(this.ctx.mockAnalyses.filter((a: any) => a.poemId === poemId));
  }

  getAnalysisById(id: number): Observable<any> {
    const analysis = this.ctx.mockAnalyses.find((a: any) => a.id === id);
    if (!analysis) throw new Error('Analysis not found');
    return this.ctx.delayed(analysis);
  }

  createAnalysis(payload: any): Observable<any> {
    const analysis = { id: this.ctx.nextId(this.ctx.mockAnalyses), ...payload };
    this.ctx.mockAnalyses.push(analysis);
    return this.ctx.delayed(analysis);
  }

  updateAnalysis(id: number, payload: any): Observable<any> {
    const analysis = this.ctx.mockAnalyses.find((a: any) => a.id === id);
    if (!analysis) throw new Error('Analysis not found');
    Object.assign(analysis, payload);
    return this.ctx.delayed(analysis);
  }

  deleteAnalysis(id: number): Observable<void> {
    this.ctx.mockAnalyses = this.ctx.mockAnalyses.filter((a: any) => a.id !== id);
    return this.ctx.delayed(undefined);
  }

  getLiteratureDashboardStats(): Observable<any> {
    return this.ctx.delayed({
      totalPoets: this.ctx.mockPoets.length,
      totalPoems: this.ctx.mockPoems.length,
      totalAnalyses: this.ctx.mockAnalyses.length,
    });
  }
}
