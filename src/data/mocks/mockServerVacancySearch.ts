import { allVacancies } from './filters-mocks';


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

// Имитация запроса к серверу
export const fetchVacancies = (params: SearchParams): Promise<typeof allVacancies> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { searchQuery, filters } = params;
        const filtered = allVacancies.filter((vacancy) => {
          // Безопасная проверка с опциональными цепочками и значениями по умолчанию
          const matchesSearch = vacancy.title?.toLowerCase().includes(searchQuery?.toLowerCase() ?? '') ?? false;

          const matchesCity = filters.city
            ? vacancy.city?.toLowerCase() === filters.city.toLowerCase()
            : true;

          const matchesPosition = filters.position
            ? vacancy.position?.toLowerCase() === filters.position.toLowerCase()
            : true;

          const matchesWorkFormat = filters.workFormat
            ? vacancy.workFormat?.toLowerCase() === filters.workFormat.toLowerCase()
            : true;

          const matchesEmploymentType = filters.employmentType
            ? vacancy.employmentType?.toLowerCase() === filters.employmentType.toLowerCase()
            : true;

          const matchesExperience = filters.experience
            ? vacancy.experience?.toLowerCase() === filters.experience.toLowerCase()
            : true;

          const matchesSalary = filters.salary
            ? vacancy.salary?.toLowerCase() === filters.salary.toLowerCase()
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
        resolve(filtered);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};