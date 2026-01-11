import { useThemeColor } from "@/hooks/use-theme-color";
import { EllipsisVertical, LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface MenuButton {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
}

interface MenuProps {
  buttons: MenuButton[];
}

export function Menu({ buttons }: MenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const iconColor = useThemeColor({}, "text");

  return (
    <>
      <EllipsisVertical
        color={iconColor}
        onPress={() => setShowMenu(!showMenu)}
      />
      {showMenu && (
        <ThemedView style={styles.container}>
          {buttons.map((button, index) => (
            <Pressable
              key={`menu-button-${index}`}
              onPress={() => {
                button.onPress();
                setShowMenu(false);
              }}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.editPressed,
              ]}
            >
              {button.icon && <button.icon size={16} color="#4f46e5" />}
              <ThemedText style={styles.editText}>{button.label}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 10,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  editPressed: {
    backgroundColor: "rgba(79,70,229,0.1)",
  },
  deletePressed: {
    backgroundColor: "rgba(220,38,38,0.1)",
  },
  editText: {
    fontSize: 14,
    fontWeight: "500",
    //color: "#111827",
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
});
