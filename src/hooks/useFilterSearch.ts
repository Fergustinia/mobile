import { cities, employmentTypes, positions, workFormats } from '@/data/mocks/filters-mocks';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { filterStorage } from '@/app/storage/filterStorage';

export const useFilterSearch = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVacancyType, setSelectedVacancyType] = useState('');
  const [selectedWorkFormat, setSelectedWorkFormat] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');

  // 🔥 загрузка сохранённого фильтра
  useEffect(() => {
    const load = async () => {
      const saved = await filterStorage.get();

      if (saved) {
        setSelectedCity(saved.city || '');
        setSelectedVacancyType(saved.position || '');
        setSelectedWorkFormat(saved.workFormat || '');
        setSelectedEmploymentType(saved.employmentType || '');
        setExperience(saved.experience || '');
        setSalary(saved.salary || '');
      }
    };

    load();
  }, []);

  // 🔥 применить
  const applyFilters = async () => {
    const filter = {
      city: selectedCity,
      position: selectedVacancyType,
      workFormat: selectedWorkFormat,
      employmentType: selectedEmploymentType,
      experience,
      salary,
    };

    await filterStorage.save(filter);

    router.push('/'); // просто назад на список
  };

  // 🔥 сброс
  const resetFilters = async () => {
    setSelectedCity('');
    setSelectedVacancyType('');
    setSelectedWorkFormat('');
    setSelectedEmploymentType('');
    setExperience('');
    setSalary('');

    await filterStorage.clear();

    router.push('/');
  };

  return {
    selectedCity, setSelectedCity,
    selectedVacancyType, setSelectedVacancyType,
    selectedWorkFormat, setSelectedWorkFormat,
    selectedEmploymentType, setSelectedEmploymentType,
    experience, setExperience,
    salary, setSalary,
    applyFilters,
    resetFilters,
    cities,
    positions,
    workFormats,
    employmentTypes,
  };
};