import { cities, employmentTypes, positions, workFormats } from '@/data/mocks/filters-mocks';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';



export const useFilterSearch = () => {


    const applyFilters = () => {
        
        router.replace({
          pathname: '/',
          params: {
            city: selectedCity,
            position: selectedVacancyType,
            workFormat: selectedWorkFormat,
            employmentType: selectedEmploymentType,
            experience,
            salary,
          },
        });
      };
    

    
        const params = useLocalSearchParams<{
          city?: string;
          position?: string;
          workFormat?: string;
          employmentType?: string;
          experience?: string;
          salary?: string;
      }>(); 
      
      
    const [selectedCity, setSelectedCity] = useState(params.city || '');
    const [selectedVacancyType, setSelectedVacancyType] = useState(params.position || '');
    const [selectedWorkFormat, setSelectedWorkFormat] = useState(params.workFormat || '');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState(params.employmentType || '');
    const [experience, setExperience] = useState(params.experience || '');
    const [salary, setSalary] = useState(params.salary || '');
     
    
    return {
    selectedCity,
    setSelectedCity,
    selectedVacancyType,
    setSelectedVacancyType,
    selectedWorkFormat,
    setSelectedWorkFormat,
    selectedEmploymentType,
    setSelectedEmploymentType,
    experience,
    setExperience,
    salary,
    setSalary,
    applyFilters,
    cities,
    positions,
    workFormats,
    employmentTypes,
  };

}