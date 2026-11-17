import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import MovimientoCard from "../components/MovimientoCard";
import { obtenerMovimientos } from "../services/movimientoService";
import { AuthContext } from "../context/AuthContext";
import { USUARIO_PRUEBA_DEFAULT } from "../services/api";

export default function DashboardScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMovimientos = useCallback(async () => {
    try {
      setCargando(true);
      const data = await obtenerMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los movimientos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMovimientos();
    const unsubscribe = navigation.addListener("focus", () => {
      cargarMovimientos();
    });
    return unsubscribe;
  }, [navigation, cargarMovimientos]);

  const datosUsuario = usuario || USUARIO_PRUEBA_DEFAULT;

  const totalIngresos = movimientos
    .filter((m) => m.tipo === "Ingreso")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const totalGastos = movimientos
    .filter((m) => m.tipo === "Gasto")
    .reduce((acc, m) => acc + Number(m.monto || 0), 0);

  const balanceDisponible = totalIngresos - totalGastos;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>MiFinancista</Text>
            <Text style={styles.userGreeting}>
              Hola, {datosUsuario.nombre} 👋
            </Text>
          </View>
          <Pressable
            style={styles.userBadge}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Text style={styles.userBadgeEmoji}>👤</Text>
          </Pressable>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance Disponible</Text>
          <Text style={styles.balanceValue}>
            {balanceDisponible < 0 ? "-$ " : "$ "}
            {Math.abs(balanceDisponible).toLocaleString("es-CO")}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>⬆️ Ingresos</Text>
              <Text style={styles.summaryIncomeValue}>
                +$ {totalIngresos.toLocaleString("es-CO")}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>⬇️ Gastos</Text>
              <Text style={styles.summaryExpenseValue}>
                -$ {totalGastos.toLocaleString("es-CO")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
          <Pressable onPress={() => navigation.navigate("Historial")}>
            <Text style={styles.seeAllLink}>Ver historial ({movimientos.length}) →</Text>
          </Pressable>
        </View>

        {cargando ? (
          <View style={styles.cargando}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.cargandoText}>Cargando movimientos...</Text>
          </View>
        ) : (
          <FlatList
            data={movimientos.slice(0, 6)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovimientoCard
                movimiento={item}
                onPress={() =>
                  navigation.navigate("MovementDetail", { movimiento: item })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>
                  No hay movimientos registrados
                </Text>
                <Text style={styles.emptyText}>
                  Registra un ingreso o gasto tocando el botón + para actualizar
                  tu balance.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BottomNav activeTab="Inicio" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  appTitle: { fontSize: 21, fontWeight: "700", color: "#111827" },
  userGreeting: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  userBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  userBadgeEmoji: { fontSize: 18 },
  balanceCard: {
    backgroundColor: "#059669",
    borderRadius: 20,
    padding: 20,
    marginTop: 4,
    marginBottom: 20,
  },
  balanceLabel: { color: "#D1FAE5", fontSize: 13, fontWeight: "500" },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 6,
    alignItems: "center",
  },
  summaryItem: { flex: 1 },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    marginHorizontal: 12,
  },
  summaryLabel: { color: "#D1FAE5", fontSize: 11, marginBottom: 2 },
  summaryIncomeValue: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  summaryExpenseValue: { color: "#FEE2E2", fontSize: 14, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  seeAllLink: { fontSize: 13, fontWeight: "600", color: "#059669" },
  cargando: { flex: 1, justifyContent: "center", alignItems: "center" },
  cargandoText: { marginTop: 10, color: "#6B7280", fontSize: 13 },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    alignItems: "center",
    marginTop: 10,
  },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
