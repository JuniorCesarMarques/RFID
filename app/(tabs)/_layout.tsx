import { Tabs } from "expo-router";
import React from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="inventario"
        options={{
          title: "Inventário",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="backpack"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="monitor-dashboard"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mapa"
        options={{
          title: "Mapa",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="map-pin"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Ativos",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="attach-money"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="history"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="setting"
              size={24}
              color={`${focused ? "#007AFF" : "gray"}`}
            />
          ),
        }}
      />
    </Tabs>
  );
}
