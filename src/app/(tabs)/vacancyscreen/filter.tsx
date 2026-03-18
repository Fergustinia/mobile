import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

//Тоже уберу в моки
const cities = [
  { id: 'c1', name: 'Москва' },
  { id: 'c2', name: 'Санкт-Петербург' },
  { id: 'c3', name: 'Казань' },
  { id: 'c4', name: 'Новосибирск' },
  { id: 'c5', name: 'Екатеринбург' },
  { id: 'c6', name: 'Томск' },
];

const positions = [
  { id: 'dev', name: 'React Native Developer' },
  { id: 'front', name: 'Frontend Developer' },
  { id: 'ui', name: 'UI/UX Designer' },
  { id: 'ios', name: 'iOS Developer' },
  { id: 'android', name: 'Android Developer' },
];

const workFormats = [
  { id: 'wrk1', name: 'Офис' },
  { id: 'wrk2', name: 'Удаленно' },
  { id: 'wrk3', name: 'Гибрид' },
];

const employmentTypes = [
  { id: 'emp1', name: 'Полная занятость' },
  { id: 'emp2', name: 'Частичная занятость' },
  { id: 'emp3', name: 'Временная работа' },
  { id: 'emp4', name: 'Стажировка' },
];

export default function VacancyFilterScreen() {

    // Получаем текущие фильтры из параметров (если они переданы)
    const params = useLocalSearchParams<{
      city?: string;
      position?: string;
      workFormat?: string;
      employmentType?: string;
      experience?: string;
      salary?: string;
  }>();

  const applyFilters = () => {
    // Возвращаемся на главный экран, передавая новые фильтры в параметрах
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




    const [selectedCity, setSelectedCity] = useState(params.city || '');
    const [selectedVacancyType, setSelectedVacancyType] = useState(params.position || '');
    const [selectedWorkFormat, setSelectedWorkFormat] = useState(params.workFormat || '');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState(params.employmentType || '');
    const [experience, setExperience] = useState(params.experience || '');
    const [salary, setSalary] = useState(params.salary || '');


    


  return (
    <View style={styles.container}>


      <Text style={styles.title}>Фильтр</Text>


      <Text style={styles.subtitle}>Город</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedCity} onValueChange={setSelectedCity}>
          <Picker.Item label="Выберите город" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Вакансия</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacancyType} onValueChange={setSelectedVacancyType}>
          <Picker.Item label="Выберите вакансию" value="" />
          {positions.map((position) => (
            <Picker.Item key={position.id} label={position.name} value={position.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Формат работы</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedWorkFormat} onValueChange={setSelectedWorkFormat}>
          <Picker.Item label="Выберите формат работы" value="" />
          {workFormats.map((format) => (
            <Picker.Item key={format.id} label={format.name} value={format.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Опыт работы</Text>

      <TextInput
        style={styles.input}
        placeholder="Введите опыт работы"
        value={experience}
        onChangeText={setExperience}
        returnKeyType="default"
      />


      <Text style={styles.subtitle}>Тип занятости</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
          <Picker.Item label="Выберите тип занятости" value="" />
          {employmentTypes.map((type) => (
            <Picker.Item key={type.id} label={type.name} value={type.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Зарплата</Text>

  
      <TextInput
        style={styles.input}
        placeholder="Введите зарплату"
        value={salary}
        onChangeText={setSalary}
        returnKeyType="default"
      />


      <Pressable style={styles.button} onPress={applyFilters}>
        <Text style={styles.buttonText}>Применить / Назад</Text>
      </Pressable>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    flex: 1,            
    height: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginRight: 12,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#111',
    marginBottom: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',

  }

});