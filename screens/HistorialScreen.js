import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import MovimientoCard from "../components/MovimientoCard";
import { obtenerMovimientos } from "../services/movimientoService";

export default function HistorialScreen({ navigation }) {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const data = await obtenerMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    const unsubscribe = navigation.addListener("focus", () => {
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation, cargarDatos]);

  const categoriasDisponibles = [
    "Todas",
    ...Array.from(new Set(movimientos.map((m) => m.categoria).filter(Boolean))),
  ];

  const movimientosFiltrados = movimientos.filter((m) => {
    const coincideTipo = filtroTipo === "Todos" || m.tipo === filtroTipo;
    const coincideCategoria =
      filtroCategoria === "Todas" || m.categoria === filtroCategoria;
    const texto = busqueda.trim().toLowerCase();
    const coincideTexto =
      !texto ||
      (m.titulo && m.titulo.toLowerCase().includes(texto)) ||
      (m.categoria && m.categoria.toLowerCase().includes(texto)) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(texto));

    return coincideTipo && coincideCategoria && coincideTexto;
  });

  const totalFiltrado = movimientosFiltrados.reduce((acc, m) => {
    const valor = Number(m.monto || 0);
    return m.tipo === "Ingreso" ? acc + valor : acc - valor;
  }, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <View>
            <Text style={styles.title}>Historial de Movimientos</Text>
            <Text style={styles.subtitle}>
              {movimientosFiltrados.length} registro(s) encontrado(s)
            </Text>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por concepto, categoría o nota..."
          placeholderTextColor="#9CA3AF"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View style={styles.typeFilterRow}>
          {["Todos", "Ingreso", "Gasto"].map((tipo) => {
            const activo = filtroTipo === tipo;
            return (
              <Pressable
                key={tipo}
                style={[styles.typePill, activo && styles.typePillActive]}
                onPress={() => setFiltroTipo(tipo)}
              >
                <Text
                  style={[
                    styles.typePillText,
                    activo && styles.typePillTextActive,
                  ]}
                >
                  {tipo === "Todos"
                    ? "Todos"
                    : tipo === "Ingreso"
                    ? "⬆️ Ingresos"
                    : "⬇️ Gastos"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {categoriasDisponibles.length > 1 ? (
          <View style={styles.catFilterWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catScroll}
            >
              {categoriasDisponibles.map((cat) => {
                const activa = filtroCategoria === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[styles.catBadge, activa && styles.catBadgeActive]}
                    onPress={() => setFiltroCategoria(cat)}
                  >
                    <Text
                      style={[
                        styles.catBadgeText,
                        activa && styles.catBadgeTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.resumeBar}>
          <Text style={styles.resumeLabel}>Balance del filtro:</Text>
          <Text
            style={[
              styles.resumeAmount,
              { color: totalFiltrado >= 0 ? "#059669" : "#EF4444" },
            ]}
          >
            {totalFiltrado >= 0 ? "+$ " : "-$ "}
            {Math.abs(totalFiltrado).toLocaleString("es-CO")}
          </Text>
        </View>

        {cargando ? (
          <View style={styles.cargando}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.cargandoText}>Cargando historial...</Text>
          </View>
        ) : (
          <FlatList
            data={movimientosFiltrados}
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
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptyText}>
                  No se encontraron movimientos con los filtros seleccionados.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BottomNav activeTab="Historial" navigation={navigation} />
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
  searchInput: {
    height: 46,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#111827",
    marginBottom: 10,
  },
  typeFilterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  typePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  typePillActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  typePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  typePillTextActive: {
    color: "#FFFFFF",
  },
  catFilterWrapper: {
    marginBottom: 10,
  },
  catScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  catBadgeActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#059669",
  },
  catBadgeText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  catBadgeTextActive: {
    color: "#059669",
    fontWeight: "700",
  },
  resumeBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  resumeLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  resumeAmount: { fontSize: 14, fontWeight: "700" },
  cargando: { flex: 1, justifyContent: "center", alignItems: "center" },
  cargandoText: { marginTop: 10, color: "#6B7280", fontSize: 13 },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    alignItems: "center",
    marginTop: 14,
  },
  emptyEmoji: { fontSize: 32, marginBottom: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  emptyText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
});
