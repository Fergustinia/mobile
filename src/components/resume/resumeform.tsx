import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
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
import { resumes } from '../../data/mocks/resumes';

interface ResumeFormData {
  template: string;
  fullName: string;
  experience: string;
  skills: string;
  education: string;
  contacts: string;
}

const TEMPLATES = [
  { label: 'Выбрать шаблон', value: '' },
  { label: 'Классический', value: 'classic' },
  { label: 'Современный', value: 'modern' },
  { label: 'Минималистичный', value: 'minimal' },
];

interface ResumeFormProps {
  resumeId?: string;
  isEditMode?: boolean;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ 
  resumeId, 
  isEditMode = false 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ResumeFormData>({
    template: '',
    fullName: '',
    experience: '',
    skills: '',
    education: '',
    contacts: '',
  });

  // Загрузка данных при редактировании
  useEffect(() => {
    if (isEditMode && resumeId) {
      const existingResume = resumes.find(r => r.id === resumeId);
      if (existingResume) {
        setFormData({
          template: existingResume.template || '',
          fullName: existingResume.fullName || '',
          experience: existingResume.experience || '',
          skills: existingResume.skills?.join(', ') || '',
          education: existingResume.education || '',
          contacts: existingResume.contacts || '',
        });
      }
    }
  }, [isEditMode, resumeId]);

  const handleInputChange = (field: keyof ResumeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните поле ФИО');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Здесь будет логика сохранения резюме
    Alert.alert(
      isEditMode ? 'Резюме обновлено' : 'Резюме создано',
      isEditMode 
        ? 'Ваше резюме успешно обновлено' 
        : 'Ваше резюме успешно сохранено',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Отмена',
      'Вы уверены, что хотите отменить создание резюме?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCreateTemplate = () => {
    Alert.alert('Создание шаблона', 'Функция создания шаблона');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Шаблоны */}
        <View style={styles.field}>
          <Text style={styles.label}>Шаблоны</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.template}
              onValueChange={(value) => handleInputChange('template', value)}
              style={styles.picker}
            >
              {TEMPLATES.map((template) => (
                <Picker.Item
                  key={template.value}
                  label={template.label}
                  value={template.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* ФИО */}
        <View style={styles.field}>
          <Text style={styles.label}>ФИО</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите ФИО"
            placeholderTextColor="#8E8E93"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
          />
        </View>

        {/* Опыт */}
        <View style={styles.field}>
          <Text style={styles.label}>Опыт</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Расскажите о своем опыте работы"
            placeholderTextColor="#8E8E93"
            value={formData.experience}
            onChangeText={(value) => handleInputChange('experience', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Навыки */}
        <View style={styles.field}>
          <Text style={styles.label}>Навыки</Text>
          <TextInput
            style={styles.input}
            placeholder="Перечислите ваши навыки через запятую"
            placeholderTextColor="#8E8E93"
            value={formData.skills}
            onChangeText={(value) => handleInputChange('skills', value)}
          />
        </View>

        {/* Образование */}
        <View style={styles.field}>
          <Text style={styles.label}>Образование</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Укажите ваше образование"
            placeholderTextColor="#8E8E93"
            value={formData.education}
            onChangeText={(value) => handleInputChange('education', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Контакты */}
        <View style={styles.field}>
          <Text style={styles.label}>Контакты</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Телефон, email, Telegram и т.д."
            placeholderTextColor="#8E8E93"
            value={formData.contacts}
            onChangeText={(value) => handleInputChange('contacts', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Кнопка создания шаблона */}
        <TouchableOpacity 
          style={styles.createTemplateButton}
          onPress={handleCreateTemplate}
        >
          <Text style={styles.createTemplateButtonText}>Создать шаблон</Text>
        </TouchableOpacity>

        {/* Отступ перед кнопками действий */}
        <View style={styles.actionsSpacer} />
      </ScrollView>

      {/* Кнопки действий */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
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
  formContainer: {
    flex: 1,
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 12,
    fontSize: 16,
    color: '#000000',
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  createTemplateButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  createTemplateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  actionsSpacer: {
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
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ResumeForm;