import type { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import type {
  EducationalProcessDto,
  CreateEducationalProcessRequest,
  UpdateEducationalProcessRequest,
  ProcessTriggerResultDto,
  EducationalEntityType,
} from '../models/lesson-planner.models';

export function withEducationalProcess<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    getEducationalProcesses(): Observable<EducationalProcessDto[]> {
      return this.educationalProcess.getEducationalProcesses();
    }

    getEducationalProcessById(id: number): Observable<EducationalProcessDto> {
      return this.educationalProcess.getEducationalProcessById(id);
    }

    getEducationalProcessesByEntityType(entityType: EducationalEntityType): Observable<EducationalProcessDto[]> {
      return this.educationalProcess.getEducationalProcessesByEntityType(entityType);
    }

    createEducationalProcess(request: CreateEducationalProcessRequest): Observable<EducationalProcessDto> {
      return this.educationalProcess.createEducationalProcess(request);
    }

    updateEducationalProcess(id: number, request: UpdateEducationalProcessRequest): Observable<EducationalProcessDto> {
      return this.educationalProcess.updateEducationalProcess(id, request);
    }

    deleteEducationalProcess(id: number): Observable<void> {
      return this.educationalProcess.deleteEducationalProcess(id);
    }

    triggerProcess(request: { entityType: EducationalEntityType; entityId: number }): Observable<ProcessTriggerResultDto> {
      return this.educationalProcess.triggerProcess(request);
    }
  };
}
