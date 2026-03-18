import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { allVacancies } from '../data/mocks/filters-mocks';
import { fetchVacancies, SearchParams } from '../data/mocks/mockServerVacancySearch';

export type Filters = {
  city: string;
  position: string;
  workFormat: string;
  employmentType: string;
  experience: string; 
  salary: string;     
};

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
  const [results, setResults] = useState<typeof allVacancies>([]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Функция поиска/фильтрации вакансий
  const handleSearch = useCallback(() => {
    // Отменяем предыдущий таймаут
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setLoading(true);

    // Имитация запроса к серверу
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const params: SearchParams = { searchQuery, filters };
        const data = await fetchVacancies(params);    //загружаем вакансии с сервера с учетом поискового запроса и фильтров
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
  }, []); 

  
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  

  
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