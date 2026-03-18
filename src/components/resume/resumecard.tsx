import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Resume } from '../../data/mocks/resumes';

interface ResumeCardProps {
  resume: Resume;
  onPress?: () => void;
  onMenuPress?: () => void;
}

export const ResumeCardItem: React.FC<ResumeCardProps> = ({
  resume,
  onPress,
  onMenuPress,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{resume.name}</Text>
          <Text style={styles.cardSubtitle}>Название/профессия</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.updateDate}>
            {formatDate(resume.updatedAt)}
          </Text>
          {resume.isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Рекомендуемое</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

// Компонент скелетона для загрузки
export const ResumeCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.skeleton}>
        <View style={[styles.skeletonBar, { width: '60%', height: 20 }]} />
        <View style={[styles.skeletonBar, { width: '40%', height: 14, marginTop: 8 }]} />
      </View>
      <View style={styles.skeleton}>
        <View style={[styles.skeletonBar, { width: '50%', height: 14 }]} />
      </View>
    </View>
    <View style={styles.menuButton}>
      <View style={[styles.skeletonBar, { width: 20, height: 20 }]} />
    </View>
  </View>
);

interface ResumeListScreenProps {
  resumes: Resume[];
  isLoading?: boolean;
  on_resumePress?: (resume: Resume) => void;
  on_menuPress?: (resume: Resume) => void;
  onRefresh?: () => void;
}

export const ResumeListScreen: React.FC<ResumeListScreenProps> = ({
  resumes,
  isLoading = false,
  on_resumePress,
  on_menuPress,
  onRefresh,
}) => {
  const router = useRouter();

  // 🔵 Loading State - скелетоны
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.skeletonBar, { width: 150, height: 30 }]} />
        </View>
        <View style={styles.listContent}>
          {[1, 2, 3].map((i) => (
            <ResumeCardSkeleton key={i} />
          ))}
        </View>
      </View>
    );
  }

  // 📭 Empty State
  if (resumes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyTitle}>У вас пока нет резюме</Text>
        <Text style={styles.emptyText}>
          Создайте первое резюме, чтобы начать откликаться на вакансии
        </Text>
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => router.push('/(tabs)/resume/create')}
        >
          <Text style={styles.emptyButtonText}>Создать первое резюме</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Normal State - список
  return (
    <View style={styles.container}>
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ResumeCardItem
            resume={item}
            onPress={() => on_resumePress?.(item)}
            onMenuPress={() => on_menuPress?.(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(tabs)/resume/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  updateDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  recommendedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  menuButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    minWidth: 48,
  },
  menuIcon: {
    fontSize: 20,
    color: '#8E8E93',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  // Skeleton styles
  skeleton: {
    flex: 1,
  },
  skeletonBar: {
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
});

export default ResumeListScreen;