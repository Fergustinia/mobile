import { apiMocks } from './api-mocks';
import { resumes } from './resumes';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockServer = {
  fetchResumes: async () => {
    const { delay: ms, success } = apiMocks.apiResponses.fetchResumes;
    await delay(ms);
    if (!success) throw new Error('Failed to fetch resumes');
    return resumes;
  },

  submitApplication: async (vacancyId: string, resumeId: string) => {
    const { delay: ms, success, message } = apiMocks.apiResponses.submitApplication;
    await delay(ms);
    if (!success) throw new Error('Failed to submit application');
    
    console.log('[Mock] Application: vacancy=${vacancyId}, resume=${resumeId}');
    return { success: true, message, applicationId: 'app_${Date.now()}' };
  },
};