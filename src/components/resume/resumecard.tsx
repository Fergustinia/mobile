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
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{resume.name}</Text>
          {resume.skills && resume.skills.length > 0 && (
            <Text style={styles.skillsText}>
              {resume.skills.slice(0, 3).join(', ')}
              {resume.skills.length > 3 && '...'}
            </Text>
          )}
        </View>
        
        <View style={styles.cardFooter}>
          {typeof resume.experience === 'number' && (
            <Text style={styles.experienceText}>
              {resume.experience} {resume.experience === 1 ? 'год' : 'лет'} опыта
            </Text>
          )}
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

interface ResumeListScreenProps {
  resumes: Resume[];
  on_resumePress?: (resume: Resume) => void;
  on_menuPress?: (resume: Resume) => void;
}

export const ResumeListScreen: React.FC<ResumeListScreenProps> = ({
  resumes,
  on_resumePress,
  on_menuPress,
}) => {
  const router = useRouter();

  if (resumes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Нет резюме</Text>
        <Text style={styles.emptyText}>
          Создайте первое резюме, чтобы начать откликаться на вакансии
        </Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/(tabs)/resume/create')}
        >
          <Text style={styles.createButtonText}>Создать резюме</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  createButtonText: {
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
  skillsText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  experienceText: {
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
});

export default ResumeListScreen;