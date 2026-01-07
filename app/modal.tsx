import { useToast } from "@/components/toast-context";
import { getDB } from "@/database/db";
import { Match } from "@/interfaces/match";
import { StageId } from "@/interfaces/worldcupMatch";
import { getNextWorldCupStage } from "@/utils/worldcup";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, Save, Shirt, Target, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const resultValues: { value: Match["result"]; label: string }[] = [
  {
    value: "w",
    label: "Ganado",
  },
  { value: "d", label: "Empatado" },
  { value: "l", label: "Perdido" },
];
const shirtValues: { value: Match["shirt"]; label: string }[] = [
  {
    value: "black",
    label: "Negra",
  },
  { value: "white", label: "Blanca" },
];

export default function ModalScreen() {
  const router = useRouter();
  const [result, setResult] = useState<Match["result"]>("w");
  const [goals, setGoals] = useState(0);
  const [asists, setAsists] = useState(0);
  const [shirt, setShirt] = useState<Match["shirt"] | null>(null);
  const [registering, setRegistering] = useState(false);
  const { showToast } = useToast();

  const registerMatch = async () => {
    setRegistering(true);
    const db = await getDB();
    const worldcupMatches: any = await db.getAllAsync<Match>(
      `
      SELECT m.*
      FROM matches m
      WHERE m.worldcup_id = (
        SELECT id
        FROM worldcup
        ORDER BY updated_at DESC
        LIMIT 1
      ) AND m.stage_id IS NOT NULL
      ORDER BY m.date DESC
    `
    );
    const { id: stage_id } = getNextWorldCupStage(
      worldcupMatches[0],
      worldcupMatches
    );
    if (stage_id === StageId.GROUP_1) {
      const worldcupInserted = await db.runAsync(
        `INSERT INTO worldcup (
          stage
          ) VALUES (?)`,
        [stage_id]
      );
      await db.runAsync(
        `INSERT INTO matches (
          result, goals, asists, shirt, worldcup_id, stage_id
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result,
          goals,
          asists,
          shirt,
          worldcupInserted.lastInsertRowId,
          stage_id,
        ]
      );
    } else {
      await db.runAsync(
        `INSERT INTO matches (
          result, goals, asists, shirt, worldcup_id, stage_id
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [result, goals, asists, shirt, worldcupMatches[0].worldcup_id, stage_id]
      );
      await db.runAsync(
        `UPDATE worldcup
          SET stage = ?, updated_at = strftime('%s','now')
          WHERE id = ?;
        `,
        [stage_id, worldcupMatches[0].worldcup_id]
      );
    }
    setRegistering(false);
    router.push("/");
    showToast("Registrado correctamente");
  };

  return (
    <View style={styles.container}>
      {/* Resultado */}
      <View style={styles.section}>
        <Text style={styles.label}>Resultado</Text>

        <View style={styles.grid3}>
          {resultValues.map(({ value, label }) => (
            <Pressable
              key={value}
              onPress={() => setResult(value)}
              style={[
                styles.optionButton,
                result === value && styles[`result_${value}`],
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  result === value && styles.optionTextActive,
                ]}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Goles */}
      <View style={styles.section}>
        <Text style={styles.label}>Goles</Text>

        <View style={styles.inputWrapper}>
          <View style={[styles.iconBox, styles.accentBg]}>
            <Target size={20} color={colors.accent} />
          </View>

          <TextInput
            keyboardType="numeric"
            value={String(goals)}
            onChangeText={(v) => {
              if (Number(v) > 100) return;
              setGoals(Number(v) || 0);
            }}
            style={styles.input}
          />
        </View>
      </View>

      {/* Asistencias */}
      <View style={styles.section}>
        <Text style={styles.label}>Asistencias</Text>

        <View style={styles.inputWrapper}>
          <View style={[styles.iconBox, styles.primaryBg]}>
            <Users size={20} color={colors.primary} />
          </View>

          <TextInput
            keyboardType="numeric"
            value={String(asists)}
            onChangeText={(v) => {
              if (Number(v) > 100) return;
              setAsists(Number(v) || 0);
            }}
            style={styles.input}
          />
        </View>
      </View>

      {/* Camiseta */}
      <View style={styles.section}>
        <Text style={styles.label}>Camiseta</Text>

        <View style={styles.grid2}>
          {shirtValues.map(({ value, label }) => (
            <Pressable
              key={value}
              onPress={() => setShirt(value !== shirt ? value : null)}
              style={[
                styles.optionButton,
                shirt === value && styles.jerseyActive,
              ]}
            >
              <View style={styles.row}>
                <Shirt size={20} color={"#FFFFFF"} />
                <Text style={styles.optionText}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Link
          href="/"
          dismissTo
          disabled={registering}
          style={styles.secondaryButtonContainer}
        >
          <View style={styles.secondaryButton}>
            <ArrowLeft size={20} color={"#ffffff"} />
            <Text style={styles.buttonText}>Volver</Text>
          </View>
        </Link>

        <Pressable
          style={[styles.primaryButton, registering && styles.disabled]}
          onPress={() => registerMatch()}
          disabled={registering}
        >
          <Save size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Registrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const colors = {
  background: "#0f0f0f",
  card: "#1c1c1c",
  border: "#2a2a2a",
  foreground: "#e5e7eb",
  muted: "#9ca3af",
  primary: "#3b82f6",
  accent: "#a855f7",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.foreground,
  },
  grid3: {
    flexDirection: "row",
    gap: 12,
  },
  grid2: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  optionText: {
    fontWeight: "600",
    color: colors.foreground,
  },
  optionTextActive: {
    color: "#fff",
  },

  result_w: { backgroundColor: colors.success },
  result_d: { backgroundColor: colors.warning },
  result_l: { backgroundColor: colors.danger },

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  iconBox: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  accentBg: { backgroundColor: "rgba(168,85,247,0.1)" },
  primaryBg: { backgroundColor: "rgba(59,130,246,0.1)" },

  input: {
    paddingLeft: 72,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  jerseyActive: {
    borderWidth: 2,
    borderColor: colors.foreground,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
  },
  secondaryButtonContainer: { flex: 1 },
  secondaryButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButton: {
    flex: 2,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: "600",
    color: colors.foreground,
  },
  primaryButtonText: {
    fontWeight: "600",
    color: "#fff",
  },
});
