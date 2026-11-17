import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { iniciarSesion } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const CORREO_DEMO = "demo@mifinancista.com";
const PASSWORD_DEMO = "password123";

export default function LoginScreen({ navigation }) {
  const { establecerSesion } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorVisual, setErrorVisual] = useState("");

  const cargarCredencialesDemo = () => {
    setCorreo(CORREO_DEMO);
    setPassword(PASSWORD_DEMO);
    setErrorVisual("");
  };

  const realizarLogin = async () => {
    setErrorVisual("");

    if (!correo.trim() || !password.trim()) {
      setErrorVisual("Todos los campos son obligatorios.");
      Alert.alert("Campos requeridos", "Ingrese correo y contraseña.");
      return;
    }

    if (!correo.includes("@")) {
      setErrorVisual("Ingrese un formato de correo electrónico válido.");
      Alert.alert(
        "Correo inválido",
        "Ingrese un formato de correo electrónico válido."
      );
      return;
    }

    try {
      setCargando(true);
      const respuesta = await iniciarSesion(correo.trim(), password);
      await establecerSesion(respuesta.token, respuesta.usuario);
      navigation.replace("Dashboard");
    } catch (error) {
      setErrorVisual(error.message);
      Alert.alert("Error de inicio de sesión", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>💲</Text>
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            Ingresa con tu cuenta para gestionar tus finanzas
          </Text>
        </View>

        <View style={styles.demoCard}>
          <View style={styles.demoHeaderRow}>
            <Text style={styles.demoTitle}>🧪 Usuario de Prueba Precargado</Text>
            <Pressable
              style={styles.fillDemoBtn}
              onPress={cargarCredencialesDemo}
            >
              <Text style={styles.fillDemoBtnText}>Usar Demo</Text>
            </Pressable>
          </View>
          <Text style={styles.demoCredential}>
            Correo: <Text style={styles.demoBold}>{CORREO_DEMO}</Text>
          </Text>
          <Text style={styles.demoCredential}>
            Contraseña: <Text style={styles.demoBold}>{PASSWORD_DEMO}</Text>
          </Text>
        </View>

        {errorVisual ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorVisual}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[
            styles.input,
            errorVisual && !correo.trim() && styles.inputError,
          ]}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={[
            styles.input,
            errorVisual && !password.trim() && styles.inputError,
          ]}
          placeholder="Ingrese su contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#059669"
            style={{ marginTop: 24 }}
          />
        ) : (
          <Pressable style={styles.buttonPrimary} onPress={realizarLogin}>
            <Text style={styles.buttonPrimaryText}>Iniciar Sesión</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.switchAuth}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.switchAuthText}>
            ¿No tienes cuenta? <Text style={styles.linkText}>Regístrate</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  header: { alignItems: "center", marginBottom: 18 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoIcon: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  demoCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  demoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },
  fillDemoBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fillDemoBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  demoCredential: {
    fontSize: 12,
    color: "#047857",
    marginTop: 2,
  },
  demoBold: {
    fontWeight: "700",
    color: "#064E3B",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: { color: "#B91C1C", fontSize: 12, fontWeight: "600" },
  label: { fontSize: 13, color: "#4B5563", marginBottom: 6, marginTop: 10 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#111827",
  },
  inputError: { borderColor: "#EF4444" },
  buttonPrimary: {
    height: 50,
    backgroundColor: "#059669",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  buttonPrimaryText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  switchAuth: { marginTop: 20, alignItems: "center" },
  switchAuthText: { fontSize: 13, color: "#6B7280" },
  linkText: { color: "#059669", fontWeight: "600" },
});
