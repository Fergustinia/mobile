import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useFilterSearch } from '@/hooks/useFilterSearch';



export default function VacancyFilterScreen() {

  const {
    selectedCity, setSelectedCity,
    selectedVacancyType, setSelectedVacancyType,
    selectedWorkFormat, setSelectedWorkFormat,
    selectedEmploymentType, setSelectedEmploymentType,
    experience, setExperience,
    salary, setSalary,
    applyFilters,
    cities, positions, workFormats, employmentTypes,
    } = useFilterSearch();
  

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