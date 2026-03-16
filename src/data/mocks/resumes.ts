import { apiMocks } from './api-mocks';

export type Resume = {
  id: string;
  name: string;
  isRecommended: boolean;
  skills?: readonly string[];
  experience?: number;
};

export const resumes: readonly Resume[] = apiMocks.resumes;
export const vacancyMock = apiMocks.vacancy;