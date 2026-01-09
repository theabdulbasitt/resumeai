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

export interface ResumeData {
  userInfo: UserInfo;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  leadershipRoles: LeadershipRole[];
  templateSelected: 'classic' | 'modern' | 'minimal';
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
  templateSelected: 'modern',
};
