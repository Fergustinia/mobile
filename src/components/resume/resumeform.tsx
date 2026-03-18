import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { resumeStorage } from '../../app/storage/resume';

export const ResumeForm: React.FC = () => {
  const router = useRouter();
  const { resumeId } = useLocalSearchParams<{ resumeId?: string }>();
  const isEditMode = !!resumeId;

  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    isRecommended: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && resumeId) {
      loadResume(resumeId);
    }
  }, [isEditMode, resumeId]);

  const loadResume = async (id: string) => {
    try {
      const resume = await resumeStorage.getById(id);
      if (resume) {
        setFormData({
          name: resume.name,
          skills: resume.skills?.join(', ') || '',
          experience: resume.experience?.toString() || '',
          isRecommended: resume.isRecommended,
        });
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить резюме');
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Введите название резюме');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate() || loading) return;

    setLoading(true);
    try {
      const resumeData = {
        name: formData.name.trim(),
        skills: formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean) as readonly string[],
        experience: formData.experience ? parseInt(formData.experience, 10) : undefined,
        isRecommended: formData.isRecommended,
      };

      if (isEditMode && resumeId) {
        await resumeStorage.update(resumeId, resumeData);
        Alert.alert('Успех', 'Резюме обновлено', () => router.back());
      } else {
        await resumeStorage.create(resumeData);
        Alert.alert('Успех', 'Резюме создано', () => router.back());
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить резюме');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Отмена',
      'Отменить создание резюме?',
      [
        { text: 'Нет', style: 'cancel' },
        { text: 'Да', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>Название резюме *</Text>
          <TextInput
            style={styles.input}
            placeholder="Например: React Native Developer"
            placeholderTextColor="#8E8E93"
            value={formData.name}
            onChangeText={(val) => handleChange('name', val)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Навыки (через запятую)</Text>
          <TextInput
            style={styles.input}
            placeholder="React, TypeScript, Redux"
            placeholderTextColor="#8E8E93"
            value={formData.skills}
            onChangeText={(val) => handleChange('skills', val)}
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Опыт работы (лет)</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            placeholderTextColor="#8E8E93"
            value={formData.experience}
            onChangeText={(val) => handleChange('experience', val)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Рекомендуемое</Text>
            <Switch
              value={formData.isRecommended}
              onValueChange={(val) => handleChange('isRecommended', val)}
              trackColor={{ false: '#E5E5E5', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  form: { padding: 16 },
  field: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#000000', marginBottom: 8 },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 14,
    fontSize: 16,
    color: '#000000',
    minHeight: 50,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  spacer: { height: 20 },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#000000' },
  saveButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: { backgroundColor: '#A0C4FF' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default ResumeForm;