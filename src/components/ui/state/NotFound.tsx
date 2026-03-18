
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type EmptyResultsViewProps = {
  onRetry: () => void; // функция, которая будет вызываться при нажатии на кнопку
};

const EmptyResultsView = ({ onRetry }: EmptyResultsViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>Результаты не найдены</Text>
      <Text style={styles.subtitle}>Попробуйте изменить параметры поиска или фильтры</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Сбросить фильтры</Text>
      </TouchableOpacity>
    </View>
  );
};

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EmptyResultsView;