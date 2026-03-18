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
  return new Promise((resolve) => {
    setTimeout(() => {
      const { searchQuery, filters } = params;

      const filtered = allVacancies.filter((vacancy) => {
        const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase());

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
    }, 500); // Задержка 500 мс, как в текущей имитации
  });
};