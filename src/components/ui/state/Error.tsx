import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ErrorViewProps = {
  onRetry: () => void;
};

const ErrorView = ({ onRetry }: ErrorViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🌐</Text>

      <Text style={styles.title}>Ошибка загрузки</Text>
      <Text style={styles.subtitle}>Повторите попытку позже</Text>

      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Перезагрузить ↻</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  icon: {
    fontSize: 50,
    marginBottom: 20,
    color: "#999",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 40,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ErrorView;