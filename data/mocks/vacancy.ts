import { WorkFormat } from './WorkFormat';
export type Vacancy = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  salary: number;
    workFormat: WorkFormat; 
  
};