import { useState, useCallback, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchVacancies, SearchParams } from '../data/mocks/mockServerVacancySearch'; // Импортируем функцию с фильтрацией

interface Vacancy {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string;
  conditions?: string;
  salary: string;
  workFormat: string;
  city: string;
  position: string;
  employmentType: string;
  experience: string;
}

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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Vacancy[]>([]); // Результаты теперь пустые, будут заполняться после фильтрации

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const params: SearchParams = { searchQuery, filters };
        const data = await fetchVacancies(params); // Вызываем fetchVacancies для получения отфильтрованных данных
        setResults(data);
      } catch (error) {
        console.error('Ошибка загрузки вакансий:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [searchQuery, filters]);

  useEffect(() => {
    handleSearch();
  }, [filters]);

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
    if (city || position || workFormat || employmentType || experience || salary) {
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

  const resetFiltersAndSearch = () => {
    setFilters({
      city: '',
      position: '',
      workFormat: '',
      employmentType: '',
      experience: '',
      salary: '',
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    loading,
    results,
    handleSearch,
    openFilterScreen,
    resetFiltersAndSearch,
  };
};