import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StatCard } from "@/components/ui/stat-card";
import { getDB } from "@/database/db";
import { Match } from "@/interfaces/match";
import { getStageNameById } from "@/utils/worldcup";
import { useEffect, useState } from "react";

const getEffectivityValue = (result: Match["result"]) => {
  if (result === "w") return 3;
  if (result === "l") return 1;
  return 0;
};

export default function StatsScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const matchesWonPercentage =
    matches.length !== 0
      ? matches.filter((match) => match.result === "w").length / matches.length
      : 0;
  const totalGoals = matches.reduce((total, match) => total + match.goals, 0);
  const totalAsists = matches.reduce((total, match) => total + match.asists, 0);
  const blackMatches = matches.filter((match) => match.shirt === "black");
  const whiteMatches = matches.filter((match) => match.shirt === "white");
  const blackMatchesEffectivity =
    blackMatches.length !== 0
      ? blackMatches.reduce(
          (total, match) => total + getEffectivityValue(match.result),
          0
        ) /
        (3 * blackMatches.length)
      : 0;
  const whiteMatchesEffectivity =
    whiteMatches.length !== 0
      ? whiteMatches.reduce(
          (total, match) => total + getEffectivityValue(match.result),
          0
        ) /
        (3 * whiteMatches.length)
      : 0;
  const bestWorldCupStage = getStageNameById(
    matches.sort((a, b) => {
      return (b.stage_id || 0) - (a.stage_id || 0);
    })[0]?.stage_id
  );
  const worldcupsWon = matches.filter(
    (m) => m.stage_id === 7 && m.result === "w"
  ).length;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    loadMatches();
  };

  const loadMatches = async () => {
    const db = await getDB();
    const matchesDb: any = await db.getAllAsync(
      `SELECT * FROM matches ORDER BY date DESC`
    );
    setMatches(matchesDb);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          style={styles.headerImage}
          size={310}
          color="#f3f870ff"
          name="chart.bar"
        />
      }
    >
      <StatCard
        title={"Porcentaje de ganados"}
        value={`${(matchesWonPercentage * 100).toFixed(1)}%`}
      />
      <StatCard title={"Goles totales"} value={`${totalGoals}`} />
      <StatCard
        title={"Goles por partido"}
        value={`${
          matches.length !== 0 ? (totalGoals / matches.length).toFixed(2) : 0
        }`}
      />
      <StatCard title={"Asistencias totales"} value={`${totalAsists}`} />
      <StatCard
        title={"Asistencias por partido"}
        value={`${
          matches.length !== 0 ? (totalAsists / matches.length).toFixed(2) : 0
        }`}
      />
      <StatCard
        title={"Efectividad camiseta negra"}
        value={`${(blackMatchesEffectivity * 100).toFixed(1)}%`}
      />
      <StatCard
        title={"Efectividad camiseta blanca"}
        value={`${(whiteMatchesEffectivity * 100).toFixed(1)}%`}
      />
      <StatCard title={"Mundiales ganados"} value={worldcupsWon} />
      <StatCard title={"Mejor puesto en mundial"} value={bestWorldCupStage} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { backgroundColor: "#575a01ff" },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
