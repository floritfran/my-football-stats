import { getDB } from "@/database/db";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Match } from "@/interfaces/match";
import { StageId } from "@/interfaces/worldcupMatch";
import { useRouter } from "expo-router";
import {
  Minus,
  Pencil,
  Target,
  Trash2,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Menu } from "./menu";
import Modal from "./modal";

type MatchCardProps = {
  match: Match;
  editable?: boolean;
  onChange?: () => void;
};

export function MatchCard({ match, editable, onChange }: MatchCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const iconColor = useThemeColor({}, "text");

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

  const menuButtons = [
    {
      label: "Editar",
      icon: Pencil,
      onPress: () =>
        router.navigate({
          pathname: "/edit-match",
          params: { match: JSON.stringify(match) },
        }),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onPress: () => setShowDeleteModal(true),
    },
  ];

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

  const deleteMatch = async () => {
    if (deleting) return;

    setDeleting(true);
    const db = await getDB();
    await db.runAsync("DELETE FROM matches WHERE id = ?;", [match.id]);
    if (match.worldcup_id && match.stage_id) {
      if (match.stage_id === StageId.GROUP_1) {
        await db.runAsync("DELETE FROM worldcup WHERE id = ?;", [
          match.worldcup_id,
        ]);
      } else {
        await db.runAsync(
          `
          UPDATE worldcup
          SET stage = ?, updated_at = strftime('%s','now')
          WHERE id = ?;`,
          [match.stage_id - 1, match.worldcup_id]
        );
      }
    }
    setShowDeleteModal(false);
    setDeleting(false);
    if (onChange) onChange();
  };

  return (
    <View style={[styles.card, styles[`card_${match.result}`]]}>
      <View style={styles.header}>
        <View style={[styles.badge, styles[`badge_${match.result}`]]}>
          <Icon color={styles[`badgeText_${match.result}`].color} />
          <ThemedText
            style={[styles.badgeText, styles[`badgeText_${match.result}`]]}
          >
            {config.label}
          </ThemedText>
        </View>
        <View style={styles.dateIcon}>
          <ThemedText style={styles.date}>{formatDate(match.date)}</ThemedText>
          {editable && (
            <>
              <Menu buttons={menuButtons} />
              <Modal
                visible={showDeleteModal}
                title="Eliminar partido"
                description="¿Seguro que querés eliminar el partido?"
                primaryText="Eliminar"
                secondaryText="Cancelar"
                onPrimaryPress={() => deleteMatch()}
                onSecondaryPress={() => {
                  if (deleting) return;
                  setShowDeleteModal(false);
                }}
              />
            </>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ gap: 6 }}>
          <View style={styles.iconContainer}>
            <Target color={iconColor} />
          </View>
          <View>
            <ThemedText style={styles.total}>{match.goals}</ThemedText>
            <ThemedText style={styles.totalText}>{"Goles"}</ThemedText>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <View style={styles.iconContainer}>
            <Users color={iconColor} />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
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
  dateIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  iconContainer: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  total: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "none",
  },
  totalText: {
    fontSize: 12,
    textAlign: "center",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
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
  icon: {
    color: "#ffffff",
  },
});
