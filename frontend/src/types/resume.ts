export interface UserInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
  bullets: string[];
}

export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillGroup {
  id?: string; // Optional for UI key
  category: string;
  items: string;
}

export interface CustomItem {
  title: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface ResumeData {
  userInfo: UserInfo;
  summary: string;
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  leadershipRoles: LeadershipRole[];
  customSections: CustomSection[];
  sectionOrder: string[];
  templateSelected: 'classic' | 'modern' | 'minimal';
  isCompact?: boolean;
}

export const initialResumeData: ResumeData = {
  userInfo: {
    name: '',
    title: '',
    phone: '',
    email: '',
    linkedIn: '',
    github: '',
  },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  leadershipRoles: [],
  customSections: [],
  sectionOrder: ['userInfo', 'summary', 'experience', 'projects', 'skills', 'leadership'],
  templateSelected: 'modern',
};
