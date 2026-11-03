import type { SimulationSnapshot } from "./simulation";

export interface Profile {
  name: string;
  level: string;
  goal: string;
  interests: string[];
  minutes: number;
  preference: string;
  diagnostic: Record<string, number>;
}
export interface Attempt {
  lessonId: string;
  /** Legacy attempts without this field refer to the initial 1.0.0 catalogue. */
  lessonVersion?: string;
  answers: Record<string, number>;
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  at: string;
}
export interface Project {
  id: string;
  title: string;
  problem: string;
  customer: string;
  hypothesis: string;
  nextAction: string;
  stage: string;
  lessonIds: string[];
  /** Explicit study goals, separate from knowledge associated through Apply. */
  learningGoalIds?: string[];
  createdAt: string;
}
export type ReviewRating = "again" | "hard" | "remembered";
export interface ReviewEvent {
  id: string;
  cardId: string;
  lessonId: string;
  lessonVersion: string;
  rating: ReviewRating;
  at: string;
  dueAt: string;
  intervalDays: number;
  step: number;
}
export interface ExperimentResult {
  observation: string;
  evidence: string;
  conclusion: "supported" | "refuted" | "inconclusive";
  recordedAt: string;
}
export interface ProjectExperiment {
  id: string;
  projectId: string;
  title: string;
  hypothesis: string;
  protocol: string;
  successCriterion: string;
  reviewOn: string;
  createdAt: string;
  result?: ExperimentResult;
}
export interface DecisionOutcome {
  observed: string;
  comparison: "better" | "as-expected" | "worse" | "mixed";
  learning: string;
  recordedAt: string;
}
export interface ProjectDecision {
  id: string;
  projectId: string;
  experimentId?: string;
  title: string;
  context: string;
  options: string;
  choice: string;
  expectedOutcome: string;
  confidence: number;
  risk: string;
  reviewOn: string;
  createdAt: string;
  outcome?: DecisionOutcome;
}
export interface AppState {
  schemaVersion: 1;
  profile: Profile | null;
  attempts: Attempt[];
  projects: Project[];
  notes: Record<string, string>;
  lastLessonId: string | null;
  /** Additive v1 field: older backups without it remain valid. */
  reviewEvents?: ReviewEvent[];
  experiments?: ProjectExperiment[];
  decisions?: ProjectDecision[];
  simulations?: SimulationSnapshot[];
}
export type StateUpdater = (updater: (state: AppState) => AppState) => void;
