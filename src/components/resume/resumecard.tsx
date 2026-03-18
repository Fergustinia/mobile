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
    if (!dateString) return 'Не указано';
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
        <Text style={styles.menuIcon}>≡</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/resume/create')}
        >
          <Text style={styles.createButtonText}>Создать новое резюме</Text>
        </TouchableOpacity>
      </View>

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
    paddingTop: 8,
  },
  createButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    minWidth: 50,
  },
  menuIcon: {
    fontSize: 20,
    color: '#8E8E93',
  },
});

export default ResumeListScreen;