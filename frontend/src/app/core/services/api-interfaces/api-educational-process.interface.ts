import { Observable } from 'rxjs';
import type {
  EducationalProcessDto,
  CreateEducationalProcessRequest,
  UpdateEducationalProcessRequest,
  ProcessTriggerResultDto,
  EducationalEntityType,
} from '../../models/lesson-planner.models';

export abstract class EducationalProcessApi {
  abstract getEducationalProcesses(): Observable<EducationalProcessDto[]>;
  abstract getEducationalProcessById(id: number): Observable<EducationalProcessDto>;
  abstract getEducationalProcessesByEntityType(entityType: EducationalEntityType): Observable<EducationalProcessDto[]>;
  abstract createEducationalProcess(request: CreateEducationalProcessRequest): Observable<EducationalProcessDto>;
  abstract updateEducationalProcess(id: number, request: UpdateEducationalProcessRequest): Observable<EducationalProcessDto>;
  abstract deleteEducationalProcess(id: number): Observable<void>;
  abstract triggerProcess(request: { entityType: EducationalEntityType; entityId: number }): Observable<ProcessTriggerResultDto>;
}