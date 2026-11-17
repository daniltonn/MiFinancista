import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function BottomNav({ activeTab, navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tab}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.tabIcon}>🏠</Text>
        <Text
          style={[styles.tabText, activeTab === "Inicio" && styles.tabActive]}
        >
          Inicio
        </Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => navigation.navigate("Reports")}
      >
        <Text style={styles.tabIcon}>📊</Text>
        <Text
          style={[styles.tabText, activeTab === "Reportes" && styles.tabActive]}
        >
          Reportes
        </Text>
      </Pressable>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => navigation.navigate("Historial")}
      >
        <Text style={styles.tabIcon}>📋</Text>
        <Text
          style={[
            styles.tabText,
            activeTab === "Historial" && styles.tabActive,
          ]}
        >
          Historial
        </Text>
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => navigation.navigate("Perfil")}
      >
        <Text style={styles.tabIcon}>👤</Text>
        <Text
          style={[styles.tabText, activeTab === "Perfil" && styles.tabActive]}
        >
          Perfil
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 12,
    paddingTop: 6,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 11,
    color: "#6B7280",
  },
  tabActive: {
    color: "#059669",
    fontWeight: "700",
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    elevation: 5,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 30,
  },
});
