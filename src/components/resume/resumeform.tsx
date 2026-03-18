import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { resumeStorage } from '../../app/storage/resume';
import { RESUME_TEMPLATES, TemplateId } from '../../data/mocks/resumes';
import ErrorView from '../ui/state/Error';
import LoadingView from '../ui/state/Loading';

type FormState = 'idle' | 'loading' | 'error' | 'success';

export const ResumeForm: React.FC = () => {
  const router = useRouter();
  const { resumeId } = useLocalSearchParams<{ resumeId?: string }>();
  const isEditMode = !!resumeId;

  const [formState, setFormState] = useState<FormState>('idle');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('standard');
  const [formData, setFormData] = useState({
    fullName: '',
    experience: '',
    skills: '',
    education: '',
    contacts: '',
  });

  // Загрузка данных при редактировании
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
          fullName: resume.fullName || '',
          experience: resume.experience || '',
          skills: resume.skills || '',
          education: resume.education || '',
          contacts: resume.contacts || '',
        });
        setSelectedTemplate((resume.template as TemplateId) || 'standard');
      }
    } catch (error) {
      console.error('Ошибка загрузки резюме:', error);
      setFormState('error');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formState === 'error') setFormState('idle');
  };

  const validate = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните поле ФИО');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setFormState('loading');
    try {
      const resumeData = {
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        experience: formData.experience,
        skills: formData.skills,
        education: formData.education,
        contacts: formData.contacts,
        template: selectedTemplate,
        isRecommended: false,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && resumeId) {
        await resumeStorage.update(resumeId, resumeData);
      } else {
        await resumeStorage.create(resumeData);
      }

      setFormState('success');
      
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setFormState('error');
    }
  };

  const handleRetry = () => {
    setFormState('idle');
    handleSave();
  };

  const handleCancel = () => {
    router.back();
  };

  // 🔄 Loading State
  if (formState === 'loading') {
    return <LoadingView />;
  }

  // ❌ Error State
  if (formState === 'error') {
    return <ErrorView onRetry={handleRetry} />;
  }

  // ✅ Success State
  if (formState === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Резюме сохранено!</Text>
        </View>
      </View>
    );
  }

  // 📝 Normal State (форма)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Создание резюме</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Шаблоны — ВЫПАДАЮЩИЙ СПИСОК */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Шаблоны</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTemplate}
              onValueChange={(itemValue) => setSelectedTemplate(itemValue)}
              style={styles.picker}
            >
              {RESUME_TEMPLATES.map((template) => (
                <Picker.Item
                  key={template.id}
                  label={template.name}
                  value={template.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* ФИО */}
        <View style={styles.field}>
          <Text style={styles.label}>ФИО *</Text>
          <TextInput
            style={styles.input}
            placeholder="Иванов Иван Иванович"
            placeholderTextColor="#999"
            value={formData.fullName}
            onChangeText={(val) => handleChange('fullName', val)}
          />
        </View>

        {/* Опыт */}
        <View style={styles.field}>
          <Text style={styles.label}>Опыт</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Расскажите о своем опыте работы"
            placeholderTextColor="#999"
            value={formData.experience}
            onChangeText={(val) => handleChange('experience', val)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Навыки */}
        <View style={styles.field}>
          <Text style={styles.label}>Навыки</Text>
          <TextInput
            style={styles.input}
            placeholder="React, TypeScript, Node.js"
            placeholderTextColor="#999"
            value={formData.skills}
            onChangeText={(val) => handleChange('skills', val)}
          />
        </View>

        {/* Образование */}
        <View style={styles.field}>
          <Text style={styles.label}>Образование</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="ВУЗ, специальность, год окончания"
            placeholderTextColor="#999"
            value={formData.education}
            onChangeText={(val) => handleChange('education', val)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Контакты */}
        <View style={styles.field}>
          <Text style={styles.label}>Контакты</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Телефон, email, Telegram"
            placeholderTextColor="#999"
            value={formData.contacts}
            onChangeText={(val) => handleChange('contacts', val)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Кнопки действий */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Отменить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  // 📋 Стили для выпадающего списка
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000000',
  },
  // Остальные стили
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    paddingBottom: 12,
  },
  spacer: {
    height: 20,
  },
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
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default ResumeForm;