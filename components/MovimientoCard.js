import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function MovimientoCard({ movimiento, onPress }) {
  const esIngreso = movimiento.tipo === "Ingreso";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: esIngreso ? "#D1FAE5" : "#FEE2E2" },
        ]}
      >
        <Text style={styles.emoji}>{movimiento.icono || "💲"}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.titulo}>{movimiento.titulo}</Text>
        <Text style={styles.subtitulo}>
          {movimiento.categoria} • {movimiento.fecha}
        </Text>
      </View>

      <Text
        style={[
          styles.monto,
          { color: esIngreso ? "#059669" : "#EF4444" },
        ]}
      >
        {esIngreso ? "+" : "-"}$ {movimiento.monto.toLocaleString("es-CO")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: { fontSize: 18 },
  info: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: "600", color: "#111827" },
  subtitulo: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  monto: { fontSize: 14, fontWeight: "600" },
});
