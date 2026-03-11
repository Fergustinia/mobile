import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  //Picker,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { resumes, vacancyMock } from "../../data/mocks/resumes";
import { checkSkillsMatch } from "../../domain/usecases/checkSkillsMatch";
import { vacancies } from "../../data/mocks/vacancies";

const VacancyDetailView = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const vacancy = vacancies[0];
  const handleApplyPress = () => {
    setShowWarning(false);
    setSelectedResume("");
    setShowApplyModal(true);
  };


  const handleConfirmApply = () => {
    if (!selectedResume) {
      Alert.alert("Ошибка", "Выберите резюме");
      return;
    }

    const resume = resumes.find((r) => r.id === selectedResume);
    if (!resume) {
      Alert.alert("Ошибка", "Выбранное резюме не найдено");
      return;
    }

    const { isMatch } = checkSkillsMatch(resume);
    if (!isMatch) {
      setShowWarning(true);
      return; // не закрываем модал
    }

    // Всё ок
    setShowApplyModal(false);
    Alert.alert(
      "Успех",
      `Отклик отправлен с резюме "${
        resumes.find((r) => r.id === selectedResume)?.name
      }"!`
    );
  };

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>← Подробнее</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Карточка вакансии */}
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://img.icons8.com/color/96/000000/briefcase.png",
              }}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Вакансия</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Компания</Text>
            <Text style={styles.value}>{vacancy.company}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Зарплата</Text>
            <Text style={styles.value}>{vacancy.salary}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Город/формат работы</Text>
            <Text style={styles.value}>{vacancy.location}/{vacancy.format}</Text>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyPress}
          >
            <Text style={styles.applyButtonText}>Откликнуться</Text>
          </TouchableOpacity>
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.sectionText}>
           {vacancy.description}
          </Text>
        </View>

        {/* Требования */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Требования</Text>
          <Text style={styles.sectionText}>{vacancy.requirements}</Text>
        </View>

        {/* Условия */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Условия</Text>
          <Text style={styles.sectionText}>{vacancy.conditions}</Text>
        </View>
      </ScrollView>

      {/* Модальное окно отклика (поверх экрана) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showApplyModal}
        onRequestClose={() => {
          setShowApplyModal(false);
          setShowWarning(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Вакансия</Text>

            <Text style={styles.modalLabel}>Выбор резюме</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedResume}
                onValueChange={(value) => {
                  setSelectedResume(value);
                  setShowWarning(false);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Название резюме" value="" />
                {resumes.map((r) => (
                  <Picker.Item key={r.id} label={r.name} value={r.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.modalLabel}>Краткая информация о вакансии</Text>
            <Text style={styles.modalInfo}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </Text>

            {/* Предупреждение появляется после попытки подтвердить */}
            {showWarning && (
              <Text style={styles.warning}>
                Навыки не соответствуют требованиям.
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowApplyModal(false);
                  setShowWarning(false);
                }}
              >
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  showWarning ? styles.confirmButtonWarning : null,
                ]}
                onPress={handleConfirmApply}
              >
                <Text style={styles.confirmText}>
                  {showWarning ? "Подтвердить отклик" : "Откликнуться"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { padding: 8 },
  backText: { fontSize: 18, fontWeight: "500", color: "#007AFF" },
  scrollContent: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: { width: 60, height: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  label: { fontSize: 16, color: "#666" },
  value: { fontSize: 16, fontWeight: "500", color: "#333" },
  applyButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  applyButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  sectionText: { fontSize: 16, lineHeight: 24, color: "#555" },

  // Стили модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // затемнение фона
    justifyContent: "flex-start", // модал сверху
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    marginTop: 100, // отступ сверху, чтобы не прилипало к краю
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  modalInfo: { fontSize: 14, color: "#555", marginBottom: 16 },
  warning: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 16,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 24,
  },
  picker: { height: 50 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 16, color: "#333" },
  confirmButton: {
    padding: 14,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  confirmButtonWarning: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});

export default VacancyDetailView;