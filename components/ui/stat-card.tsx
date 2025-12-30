import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const variantConfig = {
    default: {
      iconBg: "#2a2a2a",
      iconColor: "#a1a1aa",
    },
    primary: {
      iconBg: "rgba(59,130,246,0.1)",
      iconColor: "#3b82f6",
    },
    accent: {
      iconBg: "rgba(168,85,247,0.1)",
      iconColor: "#a855f7",
    },
    success: {
      iconBg: "rgba(34,197,94,0.1)",
      iconColor: "#22c55e",
    },
    warning: {
      iconBg: "rgba(234,179,8,0.1)",
      iconColor: "#eab308",
    },
    danger: {
      iconBg: "rgba(239,68,68,0.1)",
      iconColor: "#ef4444",
    },
  };

  const config = variantConfig[variant];

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {Icon && (
          <View
            style={[styles.iconContainer, { backgroundColor: config.iconBg }]}
          >
            <Icon style={styles.icon} color={config.iconColor} />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{value}</Text>
          <Text style={styles.value}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#e5e7eb",
    lineHeight: 30,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
