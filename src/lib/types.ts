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
export interface AppState {
  schemaVersion: 1;
  profile: Profile | null;
  attempts: Attempt[];
  projects: Project[];
  notes: Record<string, string>;
  lastLessonId: string | null;
  /** Additive v1 field: older backups without it remain valid. */
  reviewEvents?: ReviewEvent[];
}
export type StateUpdater = (updater: (state: AppState) => AppState) => void;
