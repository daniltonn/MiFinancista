import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { eliminarMovimiento } from "../services/movimientoService";

export default function MovementDetailScreen({ route, navigation }) {
  const movimientoParam = route.params?.movimiento || {
    id: 1,
    titulo: "Almuerzo Ejecutivo",
    categoria: "Alimentación",
    icono: "🍔",
    monto: 24500,
    fecha: "16 Oct 2026, 1:15 PM",
    tipo: "Gasto",
    descripcion: "Almuerzo ejecutivo en restaurante local.",
  };

  const [movimiento, setMovimiento] = useState(movimientoParam);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (route.params?.movimiento) {
      setMovimiento(route.params.movimiento);
    }
  }, [route.params?.movimiento]);

  const esIngreso = movimiento.tipo === "Ingreso";

  const confirmarBorrado = () => {
    Alert.alert(
      "Eliminar Movimiento",
      `¿Estás seguro de que deseas eliminar permanentemente "${movimiento.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setEliminando(true);
              await eliminarMovimiento(movimiento.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Error",
                error.message || "No se pudo eliminar el movimiento."
              );
            } finally {
              setEliminando(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.navBar}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Detalle de Transacción</Text>
          <Pressable
            style={styles.navActionBtn}
            onPress={() =>
              navigation.navigate("EditTransaction", { movimiento })
            }
          >
            <Text style={styles.navActionText}>✏️</Text>
          </Pressable>
        </View>

        <View style={styles.amountCard}>
          <View
            style={[
              styles.badge,
              { backgroundColor: esIngreso ? "#D1FAE5" : "#FEE2E2" },
            ]}
          >
            <Text style={styles.badgeEmoji}>{movimiento.icono || "💲"}</Text>
          </View>
          <Text
            style={[
              styles.amountValue,
              { color: esIngreso ? "#059669" : "#EF4444" },
            ]}
          >
            {esIngreso ? "+" : "-"}$ {Number(movimiento.monto || 0).toLocaleString("es-CO")}
          </Text>
          <Text style={styles.amountStatus}>{movimiento.titulo}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Categoría</Text>
            <Text style={styles.rowValue}>{movimiento.categoria}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fecha y Hora</Text>
            <Text style={styles.rowValue}>{movimiento.fecha}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tipo de Movimiento</Text>
            <Text
              style={[
                styles.rowValue,
                { color: esIngreso ? "#059669" : "#EF4444" },
              ]}
            >
              {movimiento.tipo}
            </Text>
          </View>
          <View style={styles.divider} />

          <Text style={[styles.rowLabel, { marginTop: 10 }]}>
            Nota o Descripción
          </Text>
          <Text style={styles.noteText}>
            {movimiento.descripcion || "Sin descripción adicional."}
          </Text>
        </View>

        <Pressable
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("EditTransaction", { movimiento })
          }
        >
          <Text style={styles.editBtnText}>✏️ Editar Movimiento</Text>
        </Pressable>

        <Pressable
          style={styles.newBtn}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Text style={styles.newBtnText}>+ Registrar Nuevo Movimiento</Text>
        </Pressable>

        {eliminando ? (
          <ActivityIndicator
            size="small"
            color="#EF4444"
            style={{ marginTop: 14 }}
          />
        ) : (
          <Pressable style={styles.deleteBtn} onPress={confirmarBorrado}>
            <Text style={styles.deleteBtnText}>🗑️ Eliminar Movimiento</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: { fontSize: 18, color: "#374151" },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  navActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  navActionText: { fontSize: 16 },
  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeEmoji: { fontSize: 22 },
  amountValue: { fontSize: 28, fontWeight: "600" },
  amountStatus: {
    fontSize: 15,
    color: "#374151",
    marginTop: 4,
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 13, color: "#6B7280" },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
  noteText: { fontSize: 13, color: "#1F2937", marginTop: 6, lineHeight: 18 },
  editBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  editBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  newBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#059669",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  newBtnText: { color: "#059669", fontWeight: "600", fontSize: 14 },
  deleteBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  deleteBtnText: { color: "#DC2626", fontWeight: "600", fontSize: 14 },
});
