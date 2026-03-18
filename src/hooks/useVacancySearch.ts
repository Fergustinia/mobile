import { useState, useCallback, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { fetchVacancies, SearchParams } from '../data/mocks/mockServerVacancySearch';
import { filterStorage } from '@/app/storage/filterStorage';
import { useFocusEffect } from 'expo-router';


interface Vacancy {
  id: string;
  title: string;
  company: string;
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
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<Filters>({
    city: '',
    position: '',
    workFormat: '',
    employmentType: '',
    experience: '',
    salary: '',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Vacancy[]>([]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 загрузка фильтра при старте
  useEffect(() => {
    const loadFilters = async () => {
      const saved = await filterStorage.get();
      if (saved) {
        setFilters(saved);
      }
    };

    loadFilters();
  }, []);


  useFocusEffect(
    useCallback(() => {
      const reloadFilters = async () => {
        const saved = await filterStorage.get();
  
        if (saved) {
          setFilters(saved);
        }
      };
  
      reloadFilters();
    }, [])
  );
  
  // 🔥 поиск
  const handleSearch = useCallback((customFilters?: Filters) => {
    const activeFilters = customFilters || filters;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const params: SearchParams = {
          searchQuery,
          filters: activeFilters,
        };

        const data = await fetchVacancies(params);
        setResults(data);
      } catch (error) {
        console.error('Ошибка загрузки вакансий:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchQuery, filters]);

  // 🔥 авто-поиск при изменении фильтра
  useEffect(() => {
    handleSearch(filters);
  }, [filters]);

  // 🔥 открыть фильтр
  const openFilterScreen = () => {
    router.push('/vacancyscreen/filter');
  };

  // 🔥 сброс
  const resetFiltersAndSearch = async () => {
    const empty: Filters = {
      city: '',
      position: '',
      workFormat: '',
      employmentType: '',
      experience: '',
      salary: '',
    };

    setFilters(empty);
    await filterStorage.clear();
    handleSearch(empty);
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