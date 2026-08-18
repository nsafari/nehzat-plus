import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  AvailablePath,
  StudentPathSelection,
  PathRankingPayload,
  FinalizePathPayload,
} from '../../models/lesson-planner.models';

/**
 * Spiritual path-selection sub-domain (available paths, ranking, finalization,
 * selection history). Split from the former monolithic MockSpiritualService.
 */
export abstract class MockSpiritualPathsBaseService {
  constructor(protected ctx: MockDataContext) {}

  getAvailablePaths(studentId: number): Observable<AvailablePath[]> {
    return this.ctx.delayed(
      this.ctx.spiritualPaths.map((p) => ({
        id: p.id,
        key: p.key,
        titleFa: p.titleFa,
        descriptionFa: p.descriptionFa,
        genderMask: p.genderMask,
        sortOrder: p.sortOrder,
        ageEntryPoint: p.ageEntryPoint,
        ageFinalizePoint: p.ageFinalizePoint,
        status: p.status,
      })),
    );
  }

  submitPathRanking(
    studentId: number,
    payload: PathRankingPayload,
  ): Observable<StudentPathSelection> {
    const rankedPath = this.ctx.spiritualPaths.find((p) => p.id === payload.pathId);
    const now = this.ctx.now();
    const selection: StudentPathSelection = {
      id: this.ctx.nextId(this.ctx.studentPathSelections),
      studentId,
      hijriSelectionYear: new Date().getFullYear() - 578,
      stage: 'ranking',
      finalizedPathId: payload.pathId,
      finalizedPathTitle: rankedPath?.titleFa,
      selectedAt: now,
      updatedAt: now,
    };
    this.ctx.studentPathSelections.push(selection);
    return this.ctx.delayed(selection);
  }

  finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    const selectedPath = this.ctx.spiritualPaths.find((p) => p.id === payload.pathId);
    const now = this.ctx.now();
    const selection = this.ctx.studentPathSelections.find((s) => s.studentId === payload.studentId);
    if (selection) {
      selection.finalizedPathId = payload.pathId;
      selection.finalizedPathTitle = selectedPath?.titleFa;
      selection.stage = 'finalized';
      selection.finalizedAt = now;
      selection.updatedAt = now;
      return this.ctx.delayed(selection);
    }
    const newSelection: StudentPathSelection = {
      id: this.ctx.nextId(this.ctx.studentPathSelections),
      studentId: payload.studentId,
      hijriSelectionYear: new Date().getFullYear() - 578,
      stage: 'finalized',
      finalizedPathId: payload.pathId,
      finalizedPathTitle: selectedPath?.titleFa,
      selectedAt: now,
      finalizedAt: now,
      updatedAt: now,
    };
    this.ctx.studentPathSelections.push(newSelection);
    return this.ctx.delayed(newSelection);
  }

  switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    const selection = this.ctx.studentPathSelections.find(
      (s) => s.studentId === payload.studentId && s.stage === 'finalized',
    );
    if (selection) {
      const switchedTo = this.ctx.spiritualPaths.find((p) => p.id === payload.pathId);
      selection.finalizedPathId = payload.pathId;
      selection.finalizedPathTitle = switchedTo?.titleFa;
      selection.finalizedAt = this.ctx.now();
      selection.updatedAt = this.ctx.now();
      return this.ctx.delayed(selection);
    }
    return this.finalizePath(payload);
  }

  getStudentPathSelection(studentId: number): Observable<StudentPathSelection> {
    const selection = this.ctx.studentPathSelections.find((s) => s.studentId === studentId);
    if (!selection) return this.ctx.delayed({} as StudentPathSelection);
    return this.ctx.delayed(selection);
  }

  getStudentPathHistory(studentId: number): Observable<unknown[]> {
    return this.ctx.delayed(this.ctx.progressionRecords.filter((r) => r.studentId === studentId));
  }
}
