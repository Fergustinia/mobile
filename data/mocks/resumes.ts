// mobile/data/mocks/resumes.ts
import { apiMocks } from './api-mocks';

export type Resume = {
  id: string;
  name: string;
  isRecommended: boolean;
  skills?: string[];
  experience?: number;
};

export const resumes: Resume[] = apiMocks.resumes;
export const vacancyMock = apiMocks.vacancy;

