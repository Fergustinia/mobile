import { allVacancies } from '../mocks/vacancydata';

export interface SearchParams {
  searchQuery: string;
  filters: {
    city: string;
    position: string;
    workFormat: string;
    employmentType: string;
    experience: string;
    salary: string;
  };
}

// Типизация вакансий
export interface Vacancy {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string;  // Сделано необязательным
  conditions?: string;    // Сделано необязательным
  salary: string;
  workFormat: string;
  city: string;
  position: string;
  employmentType: string;
  experience: string;
}

// Имитация запроса к серверу
export const fetchVacancies = (params: SearchParams): Promise<Vacancy[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { searchQuery, filters } = params;
        const filtered = allVacancies.filter((vacancy) => {
          // Проверка на наличие и соответствие фильтрам
          const matchesSearch = searchQuery
            ? vacancy.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

          const matchesCity = filters.city
            ? vacancy.city.toLowerCase() === filters.city.toLowerCase()
            : true;

          const matchesPosition = filters.position
            ? vacancy.position.toLowerCase() === filters.position.toLowerCase()
            : true;

          const matchesWorkFormat = filters.workFormat
            ? vacancy.workFormat.toLowerCase() === filters.workFormat.toLowerCase()
            : true;

          const matchesEmploymentType = filters.employmentType
            ? vacancy.employmentType.toLowerCase() === filters.employmentType.toLowerCase()
            : true;

          const matchesExperience = filters.experience
            ? vacancy.experience.toLowerCase() === filters.experience.toLowerCase()
            : true;

          const matchesSalary = filters.salary
            ? vacancy.salary.toLowerCase() === filters.salary.toLowerCase()
            : true;

          return (
            matchesSearch &&
            matchesCity &&
            matchesPosition &&
            matchesWorkFormat &&
            matchesEmploymentType &&
            matchesExperience &&
            matchesSalary
          );
        });

        resolve(filtered);  // Возвращаем отфильтрованные вакансии
      } catch (error) {
        reject(error);  // В случае ошибки, отклоняем Promise
      }
    }, 500);  // Имитация задержки в 500мс
  });
};