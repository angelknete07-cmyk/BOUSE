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
export interface AppState {
  schemaVersion: 1;
  profile: Profile | null;
  attempts: Attempt[];
  projects: Project[];
  notes: Record<string, string>;
  lastLessonId: string | null;
}
export type StateUpdater = (updater: (state: AppState) => AppState) => void;
