import { useState, useCallback, useEffect, useRef } from 'react';
import { allVacancies } from '@/data/mocks/vacancydata';  // Импортируем вакансии
import { router, useLocalSearchParams } from 'expo-router';

// Интерфейс для вакансии
interface Vacancy {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  conditions: string;
  salary: string;
  workFormat: string;
  city: string;
  position: string;
  employmentType: string;
  experience: string;
}

// Интерфейс для фильтров
interface Filters {
  city: string;
  position: string;
  workFormat: string;
  employmentType: string;
  experience: string;
  salary: string;
}

export const useVacancySearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    city: '',
    position: '',
    workFormat: '',
    employmentType: '',
    experience: '',
    salary: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Vacancy[]>(allVacancies);

  const handleSearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = allVacancies.filter((vacancy: Vacancy) => {
        // Поиск по названию вакансии (регистронезависимый)
        const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Фильтры по каждому полю (если фильтр задан)
        const matchesCity = filters.city ? vacancy.city?.toLowerCase() === filters.city.toLowerCase() : true;
        const matchesPosition = filters.position ? vacancy.position?.toLowerCase() === filters.position.toLowerCase() : true;
        const matchesWorkFormat = filters.workFormat ? vacancy.workFormat?.toLowerCase() === filters.workFormat.toLowerCase() : true;
        const matchesEmploymentType = filters.employmentType ? vacancy.employmentType?.toLowerCase() === filters.employmentType.toLowerCase() : true;
        const matchesExperience = filters.experience ? vacancy.experience?.toLowerCase() === filters.experience.toLowerCase() : true;
        const matchesSalary = filters.salary ? vacancy.salary?.toLowerCase() === filters.salary.toLowerCase() : true;

        return matchesSearch && matchesCity && matchesPosition && matchesWorkFormat &&
               matchesEmploymentType && matchesExperience && matchesSalary;
      });
      setResults(filtered);  // Обновляем результаты на основе фильтрации
      setLoading(false);
    }, 500);
  }, [searchQuery, filters]);

  const openFilterScreen = () => {
    router.push({
      pathname: '/vacancyscreen/filter',
      params: {
        cityId: filters.city,
        positionId: filters.position,
        workFormatId: filters.workFormat,
        employmentTypeId: filters.employmentType,
        experience: filters.experience,
        salary: filters.salary,
      },
    });
  };

  // Получаем фильтры с главного экрана
  const { city, position, workFormat, employmentType, experience, salary } = useLocalSearchParams<{
    city?: string;
    position?: string;
    workFormat?: string;
    employmentType?: string;
    experience?: string;
    salary?: string;
  }>();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleSearch();
  }, [filters]);

  useEffect(() => {
    if (city !== undefined || position !== undefined || workFormat !== undefined || employmentType !== undefined || experience !== undefined || salary !== undefined) {
      setFilters({
        city: city || '',
        position: position || '',
        workFormat: workFormat || '',
        employmentType: employmentType || '',
        experience: experience || '',
        salary: salary || '',
      });
    }
  }, [city, position, workFormat, employmentType, experience, salary]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    loading,
    results,
    handleSearch,
    openFilterScreen,
  };
};