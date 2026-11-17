import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { AuthContext } from "../context/AuthContext";
import { obtenerMovimientos } from "../services/movimientoService";
import { obtenerPerfilUsuario } from "../services/authService";
import { USUARIO_PRUEBA_DEFAULT } from "../services/api";

export default function PerfilScreen({ navigation }) {
  const { usuario, setUsuario, cerrarSesionContext } = useContext(AuthContext);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatosPerfil = useCallback(async () => {
    try {
      setCargando(true);
      const perfil = await obtenerPerfilUsuario();
      if (perfil) {
        setUsuario(perfil);
      }
      const lista = await obtenerMovimientos();
      setMovimientos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setCargando(false);
    }
  }, [setUsuario]);

  useEffect(() => {
    cargarDatosPerfil();
    const unsubscribe = navigation.addListener("focus", () => {
      cargarDatosPerfil();
    });
    return unsubscribe;
  }, [navigation, cargarDatosPerfil]);

  const datosUsuario = usuario || USUARIO_PRUEBA_DEFAULT;

  const ingresos = movimientos.filter((m) => m.tipo === "Ingreso");
  const gastos = movimientos.filter((m) => m.tipo === "Gasto");

  const totalIngresos = ingresos.reduce(
    (acc, m) => acc + Number(m.monto || 0),
    0
  );
  const totalGastos = gastos.reduce((acc, m) => acc + Number(m.monto || 0), 0);
  const balanceNeto = totalIngresos - totalGastos;

  const gastosPorCat = {};
  gastos.forEach((m) => {
    const cat = m.categoria || "General";
    gastosPorCat[cat] = (gastosPorCat[cat] || 0) + Number(m.monto || 0);
  });

  const categoriaMayorGasto =
    Object.entries(gastosPorCat).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Sin gastos";

  const ingresosPorCat = {};
  ingresos.forEach((m) => {
    const cat = m.categoria || "General";
    ingresosPorCat[cat] = (ingresosPorCat[cat] || 0) + Number(m.monto || 0);
  });

  const fuenteMayorIngreso =
    Object.entries(ingresosPorCat).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Sin ingresos";

  const tasaAhorro =
    totalIngresos > 0
      ? Math.max(
          0,
          Math.round(((totalIngresos - totalGastos) / totalIngresos) * 100)
        )
      : 0;

  const handleCerrarSesion = async () => {
    await cerrarSesionContext();
    navigation.replace("Login");
  };

  const inicialNombre = (datosUsuario.nombre || "U").charAt(0).toUpperCase();

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
          <Text style={styles.title}>Perfil de Usuario</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{inicialNombre}</Text>
          </View>
          <Text style={styles.userName}>{datosUsuario.nombre}</Text>
          <Text style={styles.userEmail}>{datosUsuario.correo}</Text>
          <View style={styles.statusChip}>
            <Text style={styles.statusChipText}>
              ✓ {datosUsuario.rol || "Usuario de Prueba Activo"} • Desde{" "}
              {datosUsuario.fechaRegistro || "Oct 2026"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas Rápidas de Cuenta</Text>

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#059669"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🧾</Text>
                <Text style={styles.statValue}>{movimientos.length}</Text>
                <Text style={styles.statLabel}>Movimientos ({ingresos.length}⬆️ / {gastos.length}⬇️)</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🐷</Text>
                <Text style={styles.statValue}>{tasaAhorro}%</Text>
                <Text style={styles.statLabel}>Tasa de Ahorro</Text>
              </View>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Ingresos Acumulados</Text>
                <Text style={[styles.rowValue, { color: "#059669" }]}>
                  +$ {totalIngresos.toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Gastos Acumulados</Text>
                <Text style={[styles.rowValue, { color: "#EF4444" }]}>
                  -$ {totalGastos.toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Balance Disponible</Text>
                <Text
                  style={[
                    styles.rowValue,
                    { color: balanceNeto >= 0 ? "#059669" : "#EF4444" },
                  ]}
                >
                  {balanceNeto >= 0 ? "$ " : "-$ "}
                  {Math.abs(balanceNeto).toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Principal Fuente de Ingreso</Text>
                <Text style={styles.rowValue}>{fuenteMayorIngreso}</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Categoría de Mayor Gasto</Text>
                <Text style={styles.rowValue}>{categoriaMayorGasto}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.quickBtn}
            onPress={() => navigation.navigate("Reports")}
          >
            <Text style={styles.quickBtnText}>📊 Ver Reportes</Text>
          </Pressable>

          <Pressable
            style={styles.quickBtn}
            onPress={() => navigation.navigate("Historial")}
          >
            <Text style={styles.quickBtnText}>📋 Ver Historial</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleCerrarSesion}>
          <Text style={styles.logoutBtnText}>🚪 Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>

      <BottomNav activeTab="Perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 105,
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
  title: { fontSize: 21, fontWeight: "700", color: "#111827" },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 22,
    alignItems: "center",
    marginVertical: 8,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLetter: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  statusChip: {
    marginTop: 12,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    alignItems: "center",
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "700", color: "#111827" },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
  },
  rowLabel: { fontSize: 13, color: "#6B7280" },
  rowValue: { fontSize: 13, fontWeight: "700", color: "#111827" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  quickBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  quickBtnText: { color: "#059669", fontWeight: "600", fontSize: 13 },
  logoutBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 14 },
});
