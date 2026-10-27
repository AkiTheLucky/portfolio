export interface Achievement {
  title: string;
  detail: string;
  metric?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  timeframe: string;
  location: string;
  summary: string;
  achievements: Achievement[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  credential: string;
  timeframe: string;
  details: string[];
}

export interface FermiQuestion {
  id: string;
  question: string;
  answer: number;
  unit: string;
  assumptions: string[];
  explanation: string;
}

export interface BlogEntry {
  id: string;
  title: string;
  description: string;
  pubDate: string;
}
