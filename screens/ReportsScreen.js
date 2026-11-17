import React, { useState, useEffect, useCallback } from "react";
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
import { obtenerMovimientos } from "../services/movimientoService";

const COLORES_INGRESOS = [
  "#059669",
  "#10B981",
  "#34D399",
  "#0D9488",
  "#14B8A6",
  "#0EA5E9",
];

const COLORES_GASTOS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#6366F1",
];

const calcularDesglose = (listaMovimientos, totalBase, paletaColores) => {
  const mapa = {};
  listaMovimientos.forEach((m) => {
    const cat = m.categoria || "General";
    if (!mapa[cat]) {
      mapa[cat] = { total: 0, cantidad: 0, icono: m.icono || "💲" };
    }
    mapa[cat].total += Number(m.monto || 0);
    mapa[cat].cantidad += 1;
  });

  return Object.entries(mapa)
    .map(([nombre, info], idx) => ({
      nombre,
      icono: info.icono,
      total: info.total,
      cantidad: info.cantidad,
      porcentaje:
        totalBase > 0 ? Math.round((info.total / totalBase) * 100) : 0,
      color: paletaColores[idx % paletaColores.length],
    }))
    .sort((a, b) => b.total - a.total);
};

export default function ReportsScreen({ navigation }) {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [vistaActiva, setVistaActiva] = useState("Ambos");

  const cargarReporte = useCallback(async () => {
    try {
      setCargando(true);
      const data = await obtenerMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarReporte();
    const unsubscribe = navigation.addListener("focus", () => {
      cargarReporte();
    });
    return unsubscribe;
  }, [navigation, cargarReporte]);

  const ingresos = movimientos.filter((m) => m.tipo === "Ingreso");
  const gastos = movimientos.filter((m) => m.tipo === "Gasto");

  const totalIngresos = ingresos.reduce(
    (acc, m) => acc + Number(m.monto || 0),
    0
  );
  const totalGastos = gastos.reduce((acc, m) => acc + Number(m.monto || 0), 0);
  const balanceNeto = totalIngresos - totalGastos;

  const sumaFlujo = totalIngresos + totalGastos;
  const proporcionIngresos =
    sumaFlujo > 0 ? Math.round((totalIngresos / sumaFlujo) * 100) : 50;
  const proporcionGastos = sumaFlujo > 0 ? 100 - proporcionIngresos : 50;

  const tasaAhorro =
    totalIngresos > 0
      ? Math.max(
          0,
          Math.round(((totalIngresos - totalGastos) / totalIngresos) * 100)
        )
      : 0;

  const desgloseIngresos = calcularDesglose(
    ingresos,
    totalIngresos,
    COLORES_INGRESOS
  );
  const desgloseGastos = calcularDesglose(gastos, totalGastos, COLORES_GASTOS);

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
          <View>
            <Text style={styles.title}>Reportes Analíticos</Text>
            <Text style={styles.subtitle}>
              Balance detallado de ingresos y egresos
            </Text>
          </View>
        </View>

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#059669"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* Tarjetas de Resumen de Ingresos y Gastos */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, styles.incomeCardBorder]}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricIcon}>⬆️</Text>
                  <Text style={styles.metricLabel}>Ingresos Totales</Text>
                </View>
                <Text style={styles.incomeAmount}>
                  +$ {totalIngresos.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.metricFoot}>
                  {ingresos.length} transacción(es)
                </Text>
              </View>

              <View style={[styles.metricCard, styles.expenseCardBorder]}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricIcon}>⬇️</Text>
                  <Text style={styles.metricLabel}>Gastos Totales</Text>
                </View>
                <Text style={styles.expenseAmount}>
                  -$ {totalGastos.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.metricFoot}>
                  {gastos.length} transacción(es)
                </Text>
              </View>
            </View>

            {/* Balance Neto y Comparativa Visual */}
            <View style={styles.netCard}>
              <View style={styles.netRow}>
                <View>
                  <Text style={styles.netLabel}>Flujo Neto del Periodo</Text>
                  <Text
                    style={[
                      styles.netValue,
                      { color: balanceNeto >= 0 ? "#059669" : "#DC2626" },
                    ]}
                  >
                    {balanceNeto >= 0 ? "+$ " : "-$ "}
                    {Math.abs(balanceNeto).toLocaleString("es-CO")}
                  </Text>
                </View>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeLabel}>Ahorro</Text>
                  <Text style={styles.savingsBadgeVal}>{tasaAhorro}%</Text>
                </View>
              </View>

              <View style={styles.ratioBarTrack}>
                <View
                  style={[
                    styles.ratioBarIncome,
                    { flex: Math.max(proporcionIngresos, 5) },
                  ]}
                />
                <View
                  style={[
                    styles.ratioBarExpense,
                    { flex: Math.max(proporcionGastos, 5) },
                  ]}
                />
              </View>

              <View style={styles.ratioLegendRow}>
                <Text style={styles.ratioIncomeText}>
                  🟢 Ingresos ({proporcionIngresos}%)
                </Text>
                <Text style={styles.ratioExpenseText}>
                  🔴 Gastos ({proporcionGastos}%)
                </Text>
              </View>
            </View>

            {/* Selector de sección */}
            <View style={styles.filterTabs}>
              {["Ambos", "Ingresos", "Gastos"].map((tab) => {
                const activo = vistaActiva === tab;
                return (
                  <Pressable
                    key={tab}
                    style={[
                      styles.filterTabBtn,
                      activo && styles.filterTabBtnActive,
                    ]}
                    onPress={() => setVistaActiva(tab)}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        activo && styles.filterTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* SECCIÓN DE INGRESOS POR CATEGORÍA */}
            {(vistaActiva === "Ambos" || vistaActiva === "Ingresos") && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    📈 Desglose de Ingresos
                  </Text>
                  <Text style={styles.sectionTotalIncome}>
                    $ {totalIngresos.toLocaleString("es-CO")}
                  </Text>
                </View>

                {desgloseIngresos.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      No hay ingresos registrados aún.
                    </Text>
                  </View>
                ) : (
                  desgloseIngresos.map((item) => (
                    <View key={`ing-${item.nombre}`} style={styles.catCard}>
                      <View style={styles.catTopRow}>
                        <View style={styles.catLeft}>
                          <Text style={styles.catEmoji}>{item.icono}</Text>
                          <View>
                            <Text style={styles.catName}>{item.nombre}</Text>
                            <Text style={styles.catCount}>
                              {item.cantidad} registro(s) • {item.porcentaje}%
                              del ingreso
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[styles.catVal, { color: "#059669" }]}
                        >
                          +$ {item.total.toLocaleString("es-CO")}
                        </Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.max(item.porcentaje, 4)}%`,
                              backgroundColor: item.color,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* SECCIÓN DE GASTOS POR CATEGORÍA */}
            {(vistaActiva === "Ambos" || vistaActiva === "Gastos") && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    📉 Desglose de Gastos
                  </Text>
                  <Text style={styles.sectionTotalExpense}>
                    $ {totalGastos.toLocaleString("es-CO")}
                  </Text>
                </View>

                {desgloseGastos.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      No hay gastos registrados aún.
                    </Text>
                  </View>
                ) : (
                  desgloseGastos.map((item) => (
                    <View key={`gas-${item.nombre}`} style={styles.catCard}>
                      <View style={styles.catTopRow}>
                        <View style={styles.catLeft}>
                          <Text style={styles.catEmoji}>{item.icono}</Text>
                          <View>
                            <Text style={styles.catName}>{item.nombre}</Text>
                            <Text style={styles.catCount}>
                              {item.cantidad} registro(s) • {item.porcentaje}%
                              del gasto
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[styles.catVal, { color: "#EF4444" }]}
                        >
                          -$ {item.total.toLocaleString("es-CO")}
                        </Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.max(item.porcentaje, 4)}%`,
                              backgroundColor: item.color,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <BottomNav activeTab="Reportes" navigation={navigation} />
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
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
  },
  incomeCardBorder: {
    borderColor: "#A7F3D0",
    backgroundColor: "#F0FDF4",
  },
  expenseCardBorder: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metricIcon: { fontSize: 14, marginRight: 6 },
  metricLabel: { fontSize: 12, fontWeight: "600", color: "#374151" },
  incomeAmount: { fontSize: 16, fontWeight: "700", color: "#059669" },
  expenseAmount: { fontSize: 16, fontWeight: "700", color: "#DC2626" },
  metricFoot: { fontSize: 11, color: "#6B7280", marginTop: 4 },
  netCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 14,
  },
  netRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  netLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  netValue: { fontSize: 22, fontWeight: "700", marginTop: 2 },
  savingsBadge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  savingsBadgeLabel: { fontSize: 10, color: "#047857", fontWeight: "600" },
  savingsBadgeVal: { fontSize: 15, color: "#059669", fontWeight: "700" },
  ratioBarTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  ratioBarIncome: { backgroundColor: "#10B981" },
  ratioBarExpense: { backgroundColor: "#EF4444" },
  ratioLegendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratioIncomeText: { fontSize: 11, color: "#065F46", fontWeight: "600" },
  ratioExpenseText: { fontSize: 11, color: "#991B1B", fontWeight: "600" },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  filterTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  filterTabBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTabTextActive: {
    color: "#111827",
    fontWeight: "700",
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTotalIncome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
  },
  sectionTotalExpense: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  catCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 8,
  },
  catTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  catEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  catName: { fontSize: 13, fontWeight: "600", color: "#1F2937" },
  catCount: { fontSize: 11, color: "#6B7280", marginTop: 1 },
  catVal: { fontSize: 14, fontWeight: "700" },
  progressTrack: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
