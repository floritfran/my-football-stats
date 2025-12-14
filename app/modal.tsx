import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getDB } from "@/database/db";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const resultValues = [
  {
    value: "w",
    label: "Ganado",
  },
  { value: "d", label: "Empatado" },
  { value: "l", label: "Perdido" },
];
const shirtValues = [
  {
    value: "black",
    label: "Negra",
  },
  { value: "white", label: "Blanca" },
];

export default function ModalScreen() {
  const [selectedResult, setSelectedResult] = useState("w");
  const [shirt, setShirt] = useState<string | null>(null);
  const [goals, setGoals] = useState(0);
  const [asists, setAsists] = useState(0);
  const [registering, setRegistering] = useState(false);

  const getButtonStyle = (selected: boolean, index: number, total: number) => {
    let style = styles.resultButtonDefault;
    if (index === 0) {
      style = { ...style, ...styles.resultButtonFirst };
    }
    if (index === total - 1) {
      style = { ...style, ...styles.resultButtonLast };
    }
    return selected ? { ...style, ...styles.resultButtonSelected } : style;
  };

  const registerMatch = async () => {
    setRegistering(true);
    const db = await getDB();
    await db.runAsync(
      `INSERT INTO matches (
        result, goals, asists, shirt
      ) VALUES (?, ?, ?, ?)`,
      [selectedResult, goals, asists, shirt]
    );
    setRegistering(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <ThemedText>Resultado</ThemedText>
        <View style={styles.resultButtonsContainer}>
          {resultValues.map(({ value, label }, index) => (
            <TouchableOpacity
              key={`result-button-${value}`}
              style={getButtonStyle(
                selectedResult === value,
                index,
                resultValues.length
              )}
              onPress={() => setSelectedResult(value)}
              accessibilityRole="button"
            >
              <ThemedText>{label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>
      <ThemedView style={{ flexDirection: "row", gap: 16 }}>
        <ThemedView>
          <ThemedText>Goles</ThemedText>
          <TextInput
            style={styles.input}
            value={goals.toString()}
            onChange={(text) => {
              const number = Number(text.nativeEvent.text);
              if (!isNaN(number) && number >= 0 && number < 100) {
                setGoals(number);
              }
            }}
            keyboardType="numeric"
          />
        </ThemedView>
        <ThemedView>
          <ThemedText>Asistencias</ThemedText>
          <TextInput
            style={styles.input}
            value={asists.toString()}
            onChange={(text) => {
              const number = Number(text.nativeEvent.text);
              if (!isNaN(number) && number >= 0 && number < 100) {
                setAsists(number);
              }
            }}
            keyboardType="numeric"
          />
        </ThemedView>
      </ThemedView>
      <ThemedView>
        <ThemedText>Camiseta</ThemedText>
        <View style={styles.shirtButtonsContainer}>
          {shirtValues.map(({ value, label }, index) => (
            <TouchableOpacity
              key={`shirt-button-${value}`}
              style={getButtonStyle(shirt === value, index, shirtValues.length)}
              onPress={() => setShirt(value === shirt ? null : value)}
              accessibilityRole="button"
            >
              <ThemedText>{label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>
      <ThemedView style={styles.submitContainer}>
        <Pressable
          style={styles.register}
          onPress={registerMatch}
          disabled={registering}
        >
          <ThemedText>Registrar</ThemedText>
        </Pressable>
        <Link href="/" dismissTo style={styles.link} disabled={registering}>
          <ThemedText type="link" style={styles.linkText}>
            Go to home screen
          </ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingHorizontal: "10%",
  },
  link: {
    paddingVertical: 15,
  },
  linkText: {
    color: "#e504e5ff",
    fontWeight: "bold",
  },
  resultButtonsContainer: { flexDirection: "row" },
  resultButtonDefault: {
    borderColor: "#e504e5ff",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resultButtonSelected: {
    backgroundColor: "#e504e5ff",
  },
  resultButtonFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  resultButtonMid: {},
  resultButtonLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  input: {
    color: "#FFFFFF",
    borderColor: "#e504e5ff",
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  shirtButtonsContainer: {
    flexDirection: "row",
  },
  submitContainer: {
    gap: 20,
    marginTop: 50,
  },
  register: {
    backgroundColor: "#e504e5ff",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
