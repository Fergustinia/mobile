import { WorkFormat } from './WorkFormat';

export type Vacancy = {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  salary: number;
    workFormat: WorkFormat; 
  
};

//export const vacancies: readonly Vacancy[] = apiMocks.vacancies;