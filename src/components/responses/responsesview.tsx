import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getCurrentUser, User, VacancyResponse } from '../../app/storage/auth';
import LoadingView from '../ui/state/Loading';

export default function ResponsesView() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  //  Пустое состояние
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Нет откликов</Text>
      <Text style={styles.emptySubtitle}>
        Чтобы увидеть ваши отклики, откликнитесь на странице вакансий
      </Text>
      {/* Убедись, что картинка лежит по этому пути */}
      <Image
        source={require('../../../assets/images/empty-responses.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
    </View>
  );

  // Карточка отклика
  const ResponseCard = ({ item }: { item: VacancyResponse }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.info}>
        <Text style={styles.vacancyTitle}>{item.vacancyTitle}</Text>
        <Text style={styles.detailText}>Компания: {item.company}</Text>
        <Text style={styles.detailText}>Дата отклика: {item.respondedAt}</Text>
        <Text style={styles.detailText}>Статус: {item.status}</Text>

        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>Подробнее</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) return <LoadingView />;

  const hasNoResponses = !user || !user.responses || user.responses.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {hasNoResponses ? (
        <EmptyState />
      ) : (
        <FlatList
          data={user.responses}
          renderItem={({ item }) => <ResponseCard item={item} />}
          keyExtractor={(item) => item.vacancyId}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  vacancyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1C3D',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyImage: {
    width: 200,
    height: 200,
  },
});