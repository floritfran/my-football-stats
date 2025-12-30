import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { createMatchesTable } from "@/database/models/Match";
import { createStagesTable } from "@/database/models/Stage";
import { createWorldcupTable } from "@/database/models/Worldcup";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useState } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [databaseLoaded, setDatabaseLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    createOrLoadDatabase();
  }, []);

  const createOrLoadDatabase = async () => {
    await createMatchesTable();
    await createWorldcupTable();
    await createStagesTable();
    setDatabaseLoaded(true);
  };

  return databaseLoaded ? (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Registrar partido" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  ) : (
    <></>
  );
}
