import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

// Мок-данные вакансий (можно вынести в отдельный файл)
const allVacancies = [
  { id: 'vacancy_123', title: 'React Native Developer', company: 'TechCorp', description: 'Мы ищем опытного React Native разработчика для создания мобильных приложений.', salary: 'от 150 000 ₽', workFormat: 'Гибрид', city: 'Москва', position: 'React Native Developer',employmentType: 'Полная занятость', experience: '3' },
  { id: 'vacancy_124', title: 'Frontend Developer', company: 'TechCorp', description: 'Мы ищем опытного Frontend разработчика для создания веб-приложений.', salary: 'от 100 000 ₽', workFormat: 'Офис', city: 'Томск', position: 'Frontend Developer',employmentType: 'Полная занятость', experience: '2' },
  { id: 'vacancy_125', title: 'UI/UX Designer', company: 'TechCorp', description: 'Мы ищем талантливого UI/UX дизайнера для создания интуитивно понятных интерфейсов.', salary: 'от 120 000 ₽', workFormat: 'Удаленно', city: 'Казань', position: 'UI/UX Designer',employmentType: 'Полная занятость', experience: '4' },
];

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
  const [results, setResults] = useState(allVacancies);

  const handleSearch = useCallback(() => {
  setLoading(true);
  setTimeout(() => {
    const filtered = allVacancies.filter(vacancy => {
      
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

      return matchesSearch && matchesCity && matchesPosition && matchesWorkFormat &&
             matchesEmploymentType && matchesExperience && matchesSalary;
    });
    setResults(filtered);
    setLoading(false);
  }, 500);
}, [searchQuery, filters]);

  //Открываем фильтр и передаем туда уже выбранные на ранних этапах фильтры 
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

    // Получаем фильтры на главный экран
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
    // Проверяем, что хотя бы один параметр передан (чтобы не сбросить фильтры при первом рендере)
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