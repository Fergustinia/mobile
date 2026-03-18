import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ErrorView from '@/components/ui/state/Error';
import LoadingView from '@/components/ui/state/Loading';
import { useApplicationFlow } from '../../../hooks/useApplicationFlow';

// Импорт данных о вакансиях
import { allVacancies } from '@/data/mocks/vacancydata'; // Убедитесь, что путь корректный

export default function VacancyDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const vacancyId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Получаем вакансию по ID
  const vacancy = allVacancies.find(v => v.id === vacancyId);

  if (!vacancy) {
    return undefined;
  }

  const {
    modalStep,
    loading,
    selectedResumeId,
    setSelectedResumeId,
    availableResumes,
    startApplication,
    cancelApplication,
    handleConfirmResume,
    handleIgnoreWarning,
  } = useApplicationFlow(vacancyId);

  const renderModalContent = () => {
    if (loading) return <LoadingView />;
    if (modalStep === 'error') return <ErrorView onRetry={handleConfirmResume} />;

    if (modalStep === 'confirm') {
      return (
        <>
          <Text style={styles.modalTitle}>Откликнуться на вакансию?</Text>
          <Text style={styles.modalInfo}>Выберите резюме:</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedResumeId}
              onValueChange={(value) => setSelectedResumeId(value)}
            >
              <Picker.Item label="Выберите резюме" value="" />
              {availableResumes.map((resume) => (
                <Picker.Item key={resume.id} label={resume.name} value={resume.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelApplication}>
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmResume}>
              <Text style={styles.confirmText}>Продолжить</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (modalStep === 'warning') {
      return (
        <>
          <Text style={styles.modalTitle}>⚠️ Внимание</Text>
          <Text style={styles.warning}>Навыки могут не соответствовать вакансии.</Text>
          <Text style={styles.modalInfo}>Всё равно отправить отклик?</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelApplication}>
              <Text style={styles.cancelText}>Нет</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, styles.confirmButtonWarning]}
              onPress={handleIgnoreWarning}
            >
              <Text style={styles.confirmText}>Да, отправить</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (modalStep === 'success') {
      return (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.modalTitle}>Отклик отправлен!</Text>
          <Text style={styles.modalInfo}>Работодатель скоро свяжется с вами.</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/96/000000/briefcase.png' }}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>{vacancy.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Компания</Text>
            <Text style={styles.value}>{vacancy.company}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Зарплата</Text>
            <Text style={styles.value}>{vacancy.salary}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Город / формат</Text>
            <Text style={styles.value}>{vacancy.city} • {vacancy.workFormat}</Text>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={startApplication}
            disabled={modalStep !== 'hidden'}
          >
            <Text style={styles.applyButtonText}>
              {loading ? 'Отправка...' : 'Откликнуться'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.sectionText}>{vacancy.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Требования</Text>
          <Text style={styles.sectionText}>{vacancy.requirements}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Условия</Text>
          <Text style={styles.sectionText}>{vacancy.conditions}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={modalStep !== 'hidden'}
        transparent
        animationType="slide"
        onRequestClose={cancelApplication}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>{renderModalContent()}</View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#007AFF',
  },

  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  applyButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    marginTop: 100,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modalInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  warning: {
    color: '#d32f2f',
    fontSize: 15,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    padding: 14,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonWarning: {
    backgroundColor: '#ff9800',
  },
  confirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    fontSize: 40,
  },
});