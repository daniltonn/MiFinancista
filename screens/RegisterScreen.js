import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registrarUsuario } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { establecerSesion } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorVisual, setErrorVisual] = useState("");

  const realizarRegistro = async () => {
    setErrorVisual("");

    if (
      !nombre.trim() ||
      !correo.trim() ||
      !pass.trim() ||
      !confirmPass.trim()
    ) {
      setErrorVisual("Por favor complete todos los campos.");
      Alert.alert("Campos incompletos", "Por favor complete todos los campos.");
      return;
    }

    if (!correo.includes("@")) {
      setErrorVisual("Ingrese un correo electrónico válido.");
      Alert.alert("Correo inválido", "Ingrese un correo electrónico válido.");
      return;
    }

    if (pass.length < 4) {
      setErrorVisual("La contraseña debe tener al menos 4 caracteres.");
      Alert.alert(
        "Contraseña corta",
        "La contraseña debe tener al menos 4 caracteres."
      );
      return;
    }

    if (pass !== confirmPass) {
      setErrorVisual("Las contraseñas ingresadas no coinciden.");
      Alert.alert("Error", "Las contraseñas ingresadas no coinciden.");
      return;
    }

    try {
      setCargando(true);
      const res = await registrarUsuario(nombre.trim(), correo.trim(), pass);
      await establecerSesion(res.token, res.usuario);
      navigation.replace("Dashboard");
    } catch (error) {
      setErrorVisual(error.message);
      Alert.alert("Error de registro", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navBar}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Crear Cuenta</Text>
        </View>

        <Text style={styles.subtitle}>
          Regístrate para llevar tus propias finanzas en MiFinancista
        </Text>

        {errorVisual ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorVisual}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. María Gómez"
          placeholderTextColor="#9CA3AF"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 4 caracteres"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={true}
          value={pass}
          onChangeText={setPass}
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={true}
          value={confirmPass}
          onChangeText={setConfirmPass}
        />

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#059669"
            style={{ marginTop: 24 }}
          />
        ) : (
          <Pressable style={styles.buttonPrimary} onPress={realizarRegistro}>
            <Text style={styles.buttonPrimaryText}>Registrarme</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.switchAuth}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.switchAuthText}>
            ¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia Sesión</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  navBar: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  backBtnText: { fontSize: 18, color: "#374151" },
  title: { fontSize: 21, fontWeight: "600", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 12 },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: { color: "#B91C1C", fontSize: 12, fontWeight: "600" },
  label: { fontSize: 13, color: "#4B5563", marginBottom: 4, marginTop: 10 },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#111827",
  },
  buttonPrimary: {
    height: 50,
    backgroundColor: "#059669",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonPrimaryText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  switchAuth: { marginTop: 18, alignItems: "center" },
  switchAuthText: { fontSize: 13, color: "#6B7280" },
  linkText: { color: "#059669", fontWeight: "600" },
});
