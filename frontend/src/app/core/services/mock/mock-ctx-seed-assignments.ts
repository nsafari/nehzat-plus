import type { Course, Assignment, AssignmentAttachment } from '../../models/lesson-planner.models';

export interface AssignmentsSeedContext {
  courses: Course[];
  assignments: Assignment[];
  attachments: AssignmentAttachment[];
}

export function seedAssignments(ctx: AssignmentsSeedContext): void {
  const start = new Date('2026-01-01');
  let assignmentId = 1;
  let attachmentId = 1;

  ctx.courses.forEach((course) => {
    for (let day = 0; day < 36; day++) {
      const date = new Date(start);
      date.setDate(date.getDate() + day);
      const dateStr = date.toISOString().split('T')[0];

      ctx.assignments.push({
        id: assignmentId,
        courseId: course.id,
        title: `تکلیف روز ${day + 1} - ${course.title}`,
        description: `تکلیف روزانه شماره ${day + 1} برای دوره ${course.title}`,
        type: 'daily',
        maxScore: 100,
        assignmentDate: dateStr,
        status: 'published',
        instructions: 'لطفاً فایل صوتی تلاوت خود را ضبط و ارسال کنید.',
        requiredListenCount: 1,
        currentListenCount: 0,
        isRecordingUnlocked: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      });

      if (day === 0) {
        ctx.attachments.push({
          id: attachmentId++,
          assignmentId,
          title: 'فایل راهنمای صوتی',
          description: 'توضیحات تکلیف',
          kind: 'audio',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          displayOrder: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
        });
      }

      assignmentId++;
    }
  });
}
