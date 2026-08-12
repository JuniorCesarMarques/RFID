import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import Toast from "react-native-toast-message";

import Header from "@/components/Header";
import AtivosProvider from "@/contexts/AtivosContext";
import BluetoothProvider from "@/contexts/BluetoothContext";
import InventariosProvider from "@/contexts/InventariosContext";
import DatabaseProvider from "@/database/DatabaseContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import {
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#2E7D32",
      secondary: "#66BB6A",
    },
  };

  return (
    <PaperProvider theme={theme}>
        <ActionSheetProvider>
          <BluetoothProvider>
            <DatabaseProvider>
              <InventariosProvider>
                <AtivosProvider>
                  <ThemeProvider
                    value={colorScheme === "light" ? DefaultTheme : DarkTheme}
                  >
                    <Stack
                      screenOptions={{
                        header: () => <Header />,
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: true }}
                      />
                      <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal", title: "Modal" }}
                      />
                    </Stack>
                    <StatusBar style="auto" />
                  </ThemeProvider>
                  <Toast />
                </AtivosProvider>
              </InventariosProvider>
            </DatabaseProvider>
          </BluetoothProvider>
        </ActionSheetProvider>
    </PaperProvider>
  );
}
