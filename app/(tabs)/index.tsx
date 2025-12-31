import { Plus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MatchCard } from "@/components/ui/match-card";
import { getDB } from "@/database/db";
import { Match } from "@/interfaces/match";
import { Stage } from "@/interfaces/worldcupMatch";
import { getNextWorldCupStage } from "@/utils/worldcup";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [nextStage, setNextStage] = useState<Stage>();
  const lastMatches = matches.slice(0, 5);

  useEffect(() => {
    loadMatches();
    loadActualWorldcup();
  }, []);

  const loadMatches = async () => {
    const db = await getDB();
    const matchesDb: any = await db.getAllAsync(
      `SELECT * FROM matches ORDER BY date DESC`
    );
    setMatches(matchesDb);
  };

  const loadActualWorldcup = async () => {
    const db = await getDB();
    const worldcupMatchesDB: any = await db.getAllAsync<Match>(`
      SELECT m.*
      FROM matches m
      WHERE m.worldcup_id = (
        SELECT id
        FROM worldcup
        ORDER BY updated_at DESC
        LIMIT 1
      ) AND m.stage_id IS NOT NULL
      ORDER BY m.date DESC
    `);
    const stage = getNextWorldCupStage(worldcupMatchesDB[0], worldcupMatchesDB);
    setNextStage(stage);
  };

  const getLastMatchesGoals = (matchesGoals: Match[]) => {
    let goals = 0;
    for (let match of matchesGoals) {
      goals += match.goals;
    }
    return goals;
  };

  const getLastMatchesAsists = (matchesAsist: Match[]) => {
    let asists = 0;
    for (let match of matchesAsist) {
      asists += match.asists;
    }
    return asists;
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            style={styles.headerImage}
            size={310}
            color="#c6d3e0ff"
            name="soccerball"
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            My Football Stats
          </ThemedText>
          <ThemedText type="subtitle">Fase actual de mundial</ThemedText>
          <ThemedView style={styles.actualStageContainer}>
            <ThemedText style={styles.actualStageText}>
              {nextStage?.name ?? "No hay fase de mundial"}
            </ThemedText>
          </ThemedView>
          <ThemedText type="subtitle">Últimos 5 partidos</ThemedText>
          <ThemedView style={styles.lastMatchesContainer}>
            <ThemedView style={styles.lastMatchesItem}>
              <ThemedText style={styles.lastMatchesNumber}>
                {lastMatches.filter((match) => match.result === "w").length}
              </ThemedText>
              <ThemedText style={styles.lastMatchesText}>{"G"}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lastMatchesItem}>
              <ThemedText style={styles.lastMatchesNumber}>
                {lastMatches.filter((match) => match.result === "d").length}
              </ThemedText>
              <ThemedText style={styles.lastMatchesText}>{"E"}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lastMatchesItem}>
              <ThemedText style={styles.lastMatchesNumber}>
                {lastMatches.filter((match) => match.result === "l").length}
              </ThemedText>
              <ThemedText style={styles.lastMatchesText}>{"P"}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lastMatchesItem}>
              <ThemedText style={styles.lastMatchesNumber}>
                {getLastMatchesGoals(lastMatches)}
              </ThemedText>
              <ThemedText style={styles.lastMatchesText}>{"Gol"}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.lastMatchesItem}>
              <ThemedText style={styles.lastMatchesNumber}>
                {getLastMatchesAsists(lastMatches)}
              </ThemedText>
              <ThemedText style={styles.lastMatchesText}>{"Ast"}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={{ width: "100%", gap: 15 }}>
            {matches.slice(0, 5).map((match, index) => (
              <MatchCard match={match} key={`match-${index}`} />
            ))}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <View style={styles.addButton}>
        <Link href="/modal" dismissTo>
          <Plus color={"#FFFFFF"} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: { backgroundColor: "#015369ff" },
  titleContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    marginBottom: 16,
  },
  actualStageContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0d5500ff",
    backgroundColor: "#22C55E22",
    width: "95%",
    marginBottom: 16,
  },
  actualStageText: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  lastMatchesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 8,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  lastMatchesItem: {
    width: "17%",
    alignItems: "center",
  },
  lastMatchesNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#22C55E",
  },
  lastMatchesText: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#9824f8ff",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
