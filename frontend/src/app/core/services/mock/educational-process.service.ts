import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  EducationalProcessDto,
  CreateEducationalProcessRequest,
  UpdateEducationalProcessRequest,
  ProcessTriggerResultDto,
  EducationalEntityType,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockEducationalProcessService {
  private processes: EducationalProcessDto[] = [
    {
      id: 1,
      name: 'فرآیند ارزیابی استاندارد',
      description: 'فرآیند ارزیابی مستمر برای همه موجودیت‌ها',
      workflowDefinitionId: 1,
      entityType: 'Course',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'فرآیند پیگیری تکلیف',
      description: 'فرآیند یادآوری و پیگیری تکالیف ارسالی',
      workflowDefinitionId: 2,
      entityType: 'Submission',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getEducationalProcesses(): Observable<EducationalProcessDto[]> {
    return of([...this.processes]);
  }

  getEducationalProcessById(id: number): Observable<EducationalProcessDto> {
    const process = this.processes.find(p => p.id === id);
    if (!process) {
      throw new Error('فرآیند یافت نشد');
    }
    return of({ ...process });
  }

  getEducationalProcessesByEntityType(entityType: EducationalEntityType): Observable<EducationalProcessDto[]> {
    return of(this.processes.filter(p => p.entityType === entityType));
  }

  createEducationalProcess(request: CreateEducationalProcessRequest): Observable<EducationalProcessDto> {
    const newProcess: EducationalProcessDto = {
      id: this.processes.length > 0 ? Math.max(...this.processes.map(p => p.id)) + 1 : 1,
      ...request,
      isActive: request.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.processes.push(newProcess);
    return of({ ...newProcess });
  }

  updateEducationalProcess(id: number, request: UpdateEducationalProcessRequest): Observable<EducationalProcessDto> {
    const idx = this.processes.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error('فرآیند یافت نشد');
    }
    const existing = this.processes[idx];
    const updated: EducationalProcessDto = {
      ...existing,
      ...request,
      updatedAt: new Date().toISOString(),
    };
    this.processes[idx] = updated;
    return of({ ...updated });
  }

  deleteEducationalProcess(id: number): Observable<void> {
    const idx = this.processes.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error('فرآیند یافت نشد');
    }
    this.processes.splice(idx, 1);
    return of(undefined);
  }

  triggerProcess(request: { entityType: EducationalEntityType; entityId: number }): Observable<ProcessTriggerResultDto> {
    return of({
      success: true,
      workflowRequestId: 1,
      message: 'فرآیند با موفقیت شروع شد',
    });
  }
}
