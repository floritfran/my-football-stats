import {
  Minus,
  Target,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

type Match = {
  id: number;
  result: "w" | "l" | "d";
  date: number;
  goals: number;
  assists: number;
  shirt: "black" | "white";
};

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  const resultConfig = {
    w: {
      icon: Trophy,
      label: "Ganado",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
    },
    l: {
      icon: TrendingDown,
      label: "Perdido",
      color: "text-danger",
      bgColor: "bg-danger/10",
      borderColor: "border-danger/20",
    },
    d: {
      icon: Minus,
      label: "Empatado",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
    },
  };

  const config = resultConfig[match.result];
  const Icon = config.icon;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <View style={[styles.card, styles[`card_${match.result}`]]}>
      <View style={[styles.badge, styles[`badge_${match.result}`]]}>
        <Icon color={"#FFFFFF"} />
        <ThemedText
          style={[styles.badgeText, styles[`badgeText_${match.result}`]]}
        >
          {config.label}
        </ThemedText>
      </View>
      <ThemedText style={styles.date}>{formatDate(match.date)}</ThemedText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ gap: 6 }}>
          <View style={styles.iconContainer}>
            <Target color={"#FFFFFF"} />
          </View>
          <View>
            <ThemedText style={styles.total}>{match.goals}</ThemedText>
            <ThemedText style={styles.totalText}>{"Goles"}</ThemedText>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <View style={styles.iconContainer}>
            <Users color={"#FFFFFF"} />
          </View>
          <View>
            <ThemedText style={styles.total}>{match.asists}</ThemedText>
            <ThemedText style={styles.totalText}>{"Asist."}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  card_w: {
    borderColor: "rgba(34, 197, 94, 0.2)",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  card_l: {
    borderColor: "rgba(239, 68, 68, 0.2)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  card_d: {
    borderColor: "rgba(245, 158, 11, 0.2)",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  date: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  total: {
    fontSize: 20,
    fontWeight: "700",
    backgroundColor: "none",
    color: "#E5E7EB",
  },
  totalText: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    width: "50%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge_w: {
    backgroundColor: "rgba(34,197,94,0.1)",
  },
  badge_l: {
    backgroundColor: "rgba(239,68,68,0.1)",
  },
  badge_d: {
    backgroundColor: "rgba(245,158,11,0.1)",
  },
  badgeText_w: {
    color: "#22C55E",
  },
  badgeText_l: {
    color: "#EF4444",
  },
  badgeText_d: {
    color: "#F59E0B",
  },
});
