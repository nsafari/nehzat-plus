import {
  Coach,
  BranchManager,
  Parent,
  Evaluator,
  Madrasah,
  MaktabBranch,
} from '../../models/lesson-planner.models';
import {
  mockBranchManagers,
  mockParents,
  mockEvaluators,
} from '../mock-lesson-planner-data';

// ── Personnel ──
export const initialCoaches: Coach[] = [];
export const initialBranchManagers: BranchManager[] = [...mockBranchManagers];
export const initialParents: Parent[] = [...mockParents];
export const initialEvaluators: Evaluator[] = [...mockEvaluators];
export const initialMadrasahs: Madrasah[] = [];
export const initialMaktabBranches: MaktabBranch[] = [];