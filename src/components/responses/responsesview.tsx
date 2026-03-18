import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Pressable
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { getCurrentUser, User, VacancyResponse } from '../../app/storage/auth';
import { allVacancies } from '@/data/mocks/vacancydata';

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

  // ================= EMPTY =================
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Нет откликов</Text>
      <Text style={styles.emptySubtitle}>
        Чтобы увидеть отклики, откликнитесь на вакансии
      </Text>
      <Image
        source={require('../../../assets/images/empty-responses.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
    </View>
  );

  // ================= CARD =================
  const ResponseCard = ({ item }: { item: VacancyResponse }) => {
    const vacancy = allVacancies.find(v => v.id === item.vacancyId);

    if (!vacancy) return null;

    return (
      <View style={styles.card}>
        <View style={styles.imagePlaceholder} />

        <View style={styles.info}>
          <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
          <Text style={styles.detailText}>Компания: {vacancy.company}</Text>
          <Text style={styles.detailText}>Дата отклика: {item.respondedAt}</Text>
          <Text style={styles.detailText}>Статус: {item.status}</Text>

          <Pressable
            style={styles.moreButton}
            onPress={() => router.push(`/vacancyscreen/${item.vacancyId}`)}
          >
            <Text style={styles.moreButtonText}>Подробнее</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // ================= LOADING =================
  if (isLoading) return <LoadingView />;

  const responses = user?.responses || [];

  return (
    <SafeAreaView style={styles.container}>
      {responses.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={responses}
          renderItem={({ item }) => <ResponseCard item={item} />}
          keyExtractor={(item) => item.vacancyId}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

// ================= STYLES =================

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