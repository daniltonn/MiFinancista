import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { obtenerToken, obtenerUsuarioActual } from "../services/authStorage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const verificarSesion = async () => {
      const token = await obtenerToken();
      const usuario = await obtenerUsuarioActual();
      setTimeout(() => {
        if (token && usuario) {
          navigation.replace("Dashboard");
        } else {
          navigation.replace("Login");
        }
      }, 1500);
    };
    verificarSesion();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💲</Text>
        </View>
        <Text style={styles.title}>MiFinancista</Text>
        <Text style={styles.subtitle}>Tus finanzas claras y al día</Text>
      </View>

      <View style={styles.loaderContainer}>
        <View style={styles.loaderTrack}>
          <View style={styles.loaderThumb} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#059669",
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#D1FAE5",
    marginTop: 8,
    textAlign: "center",
  },
  loaderContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loaderTrack: {
    width: 130,
    height: 4,
    backgroundColor: "#047857",
    borderRadius: 2,
    overflow: "hidden",
  },
  loaderThumb: {
    width: 50,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
