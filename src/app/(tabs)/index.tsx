import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useVacancySearch } from '@/hooks/useVacancySearch';

export default function HomeScreen() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    loading,
    results,
    handleSearch,
    openFilterScreen,
  } = useVacancySearch();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Главная</Text>

      <View style={styles.searchSection}>
        {/* Кнопка фильтра */}
        <Pressable
          style={styles.filterButton}
          onPress={openFilterScreen}  // Переход на экран фильтров
        >
          <Ionicons name="options-outline" size={24} color="#fff" />
        </Pressable> 

        <TextInput
          style={styles.input}
          placeholder="Поиск"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={24} color="#fff" />
          )}
        </Pressable>       
      </View>

      {/* Рендерим вакансии */}
      {results.length === 0 ? (
        <Text>Нет вакансий по заданным параметрам</Text>
      ) : (
        results.map((vacancy) => (
          <Pressable
            key={vacancy.id}
            style={styles.card}
            onPress={() => router.push(`/vacancyscreen/${vacancy.id}`)}  // Переход на страницу с вакансией
          >
            <Text style={styles.cardTitle}>{vacancy.title}</Text>
            <Text style={styles.cardSubtitle}>{vacancy.company}</Text>
            <Text style={styles.cardSubtitle}>{vacancy.salary}</Text>
            <Text style={styles.cardSubtitle}>{vacancy.workFormat}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>{vacancy.description}</Text>
            <Text style={styles.cardBottom}>Нажмите для подробной информации</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    marginTop: 6,
    color: '#666',
  },
  input: {
    flex: 1,            
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    alignItems: 'center', 
  },
  searchButton: {
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,   
    height: 48,               
    borderRadius: 8,
    marginRight: 8,          
  },
  filterButton: {
    backgroundColor: '#6c757d', 
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,                 
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  cardBottom: {
    marginTop: 6,
    color: '#1a1919',
    fontSize: 16,
  },
});