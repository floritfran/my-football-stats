import React from "react";
import {
  Modal as ModalPrimitive,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface TopModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  primaryText: string;
  secondaryText: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
}

export default function Modal({
  visible,
  title,
  description,
  primaryText,
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
}: TopModalProps) {
  return (
    <ModalPrimitive
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      {/* Overlay bloqueante */}
      <ThemedView style={styles.overlay}>
        {/* Contenido */}
        <ThemedView style={styles.modal}>
          {title && <ThemedText style={styles.title}>{title}</ThemedText>}
          {description && (
            <ThemedText style={styles.description}>{description}</ThemedText>
          )}

          <ThemedView style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={onSecondaryPress}
            >
              <ThemedText style={styles.secondaryText}>
                {secondaryText}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primary]}
              onPress={onPrimaryPress}
            >
              <ThemedText style={styles.primaryText}>{primaryText}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ModalPrimitive>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  modal: {
    borderRadius: 16,
    padding: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  secondary: {
    backgroundColor: "#e5e7eb",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#111",
  },
});
