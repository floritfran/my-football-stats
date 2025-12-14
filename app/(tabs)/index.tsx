import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MatchCard } from "@/components/ui/match-card";
import { getDB } from "@/database/db";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const lastMatches = matches.slice(0, 5);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const db = await getDB();
    const matchesDb: any = await db.getAllAsync(
      `SELECT * FROM matches ORDER BY date DESC`
    );
    setMatches(matchesDb);
  };

  const getLastMatchesGoals = (matchesGoals) => {
    let goals = 0;
    for (let match of matchesGoals) {
      goals += match.goals;
    }
    return goals;
  };

  const getLastMatchesAsists = (matchesAsist) => {
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
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">My Football Stats</ThemedText>
          <ThemedText>Últimos 5 partidos</ThemedText>
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
            {matches.slice(0, 5).map((match) => (
              <MatchCard match={match} />
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
  titleContainer: {
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
