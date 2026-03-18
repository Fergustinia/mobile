import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Slider from '@react-native-community/slider';
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
    resetFilters,
    cities, positions, workFormats, employmentTypes,
  } = useFilterSearch();

  const [openCity, setOpenCity] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);

  const experienceOptions = [
    '0 лет',
    '1-3 года',
    '4-5 лет',
    '5+ лет',
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Фильтр</Text>

      <Pressable onPress={resetFilters}>
        <Text style={styles.reset}>Сбросить</Text>
      </Pressable>

      {/* ГОРОД */}
      <Text style={styles.label}>Город</Text>
      <Pressable style={styles.select} onPress={() => setOpenCity(true)}>
        <Text>{selectedCity || 'Выберите город'}</Text>
        <Text>⌄</Text>
      </Pressable>

      {/* ВАКАНСИЯ */}
      <Text style={styles.label}>Вакансия</Text>
      <Pressable style={styles.select} onPress={() => setOpenPosition(true)}>
        <Text>{selectedVacancyType || 'Выберите вакансию'}</Text>
        <Text>⌄</Text>
      </Pressable>

      {/* ФОРМАТ */}
      <Text style={styles.label}>Формат работы</Text>
      <View style={styles.row}>
        {workFormats.map((f) => {
          const active = selectedWorkFormat === f.name;
          return (
            <Pressable
              key={f.id}
              onPress={() => setSelectedWorkFormat(f.name)}
              style={[styles.chip, active && styles.active]}
            >
              <Text style={active && { color: '#fff' }}>{f.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ОПЫТ */}
      <Text style={styles.label}>Опыт</Text>
      <View style={styles.row}>
        {experienceOptions.map((e) => {
          const active = experience === e;
          return (
            <Pressable
              key={e}
              onPress={() => setExperience(e)}
              style={[styles.chip, active && styles.active]}
            >
              <Text style={active && { color: '#fff' }}>{e}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ТИП */}
      <Text style={styles.label}>Тип занятости</Text>
      <View style={styles.row}>
        {employmentTypes.map((t) => {
          const active = selectedEmploymentType === t.name;
          return (
            <Pressable
              key={t.id}
              onPress={() => setSelectedEmploymentType(t.name)}
              style={[styles.chip, active && styles.active]}
            >
              <Text style={active && { color: '#fff' }}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ЗАРПЛАТА */}
      <Text style={styles.label}>Зарплата</Text>
      <Text>{salary || 0} ₽</Text>

      <Slider
        minimumValue={0}
        maximumValue={300000}
        step={5000}
        value={Number(salary) || 0}
        onValueChange={(v) => setSalary(String(v))}
      />

      <Pressable style={styles.button} onPress={applyFilters}>
        <Text style={{ color: '#fff' }}>Применить</Text>
      </Pressable>

      {/* MODAL ГОРОД */}
      {openCity && (
        <View style={styles.modal}>
          <Pressable style={styles.overlay} onPress={() => setOpenCity(false)} />
          <View style={styles.sheet}>
            {cities.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  setSelectedCity(c.name);
                  setOpenCity(false);
                }}
                style={styles.item}
              >
                <Text>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* MODAL ВАКАНСИЯ */}
      {openPosition && (
        <View style={styles.modal}>
          <Pressable style={styles.overlay} onPress={() => setOpenPosition(false)} />
          <View style={styles.sheet}>
            {positions.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  setSelectedVacancyType(p.name);
                  setOpenPosition(false);
                }}
                style={styles.item}
              >
                <Text>{p.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  reset: {
    color: '#999',
    marginBottom: 10,
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    color: '#666',
  },

  select: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  active: {
    backgroundColor: '#111',
  },

  button: {
    marginTop: 'auto',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  item: {
    paddingVertical: 12,
  },
});