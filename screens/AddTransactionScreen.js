import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  crearMovimiento,
  CATEGORIAS_PREDETERMINADAS,
  CATEGORIAS_GASTO_DEFAULT,
  CATEGORIAS_INGRESO_DEFAULT,
  obtenerCategoriasUsuario,
  agregarCategoriaUsuario,
} from "../services/movimientoService";

const EMOJIS_GASTO = ["🏷️", "🛒", "🍔", "🚌", "🏠", "💊", "🎮", "📱", "💡"];
const EMOJIS_INGRESO = ["💰", "💼", "💻", "📈", "🎁", "🏦", "💵", "🏆", "✨"];

export default function AddTransactionScreen({ navigation }) {
  const [tipo, setTipo] = useState("Gasto");
  const [titulo, setTitulo] = useState("");
  const [monto, setMonto] = useState("");
  const [todasLasCategorias, setTodasLasCategorias] = useState(
    CATEGORIAS_PREDETERMINADAS
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Alimentación");
  const [iconoSeleccionado, setIconoSeleccionado] = useState("🍔");
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState("");
  const [nuevaCategoriaEmoji, setNuevaCategoriaEmoji] = useState("🏷️");
  const [fecha, setFecha] = useState(
    new Date().toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  );
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorVisual, setErrorVisual] = useState("");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const lista = await obtenerCategoriasUsuario();
        if (Array.isArray(lista) && lista.length > 0) {
          setTodasLasCategorias(lista);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    cargarCategorias();
  }, []);

  const categoriasDelTipoActual = todasLasCategorias.filter(
    (c) => c.tipo === tipo
  );

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setMostrarNuevaCategoria(false);
    setNuevaCategoriaNombre("");
    setErrorVisual("");

    const disponibles = todasLasCategorias.filter((c) => c.tipo === nuevoTipo);
    const primera =
      disponibles[0] ||
      (nuevoTipo === "Ingreso"
        ? CATEGORIAS_INGRESO_DEFAULT[0]
        : CATEGORIAS_GASTO_DEFAULT[0]);

    setCategoriaSeleccionada(primera.nombre);
    setIconoSeleccionado(primera.icono);
    setNuevaCategoriaEmoji(nuevoTipo === "Ingreso" ? "💰" : "🏷️");
  };

  const seleccionarCategoria = (cat) => {
    setCategoriaSeleccionada(cat.nombre);
    setIconoSeleccionado(cat.icono || (tipo === "Ingreso" ? "💰" : "💸"));
  };

  const handleCrearCategoria = async () => {
    const nombreLimpio = nuevaCategoriaNombre.trim();
    if (!nombreLimpio) {
      setErrorVisual(
        `Escribe el nombre de la nueva categoría de ${tipo.toLowerCase()}.`
      );
      return;
    }

    try {
      const creada = await agregarCategoriaUsuario(
        nombreLimpio,
        nuevaCategoriaEmoji,
        tipo
      );

      const yaExiste = todasLasCategorias.some(
        (c) =>
          c.tipo === tipo &&
          c.nombre.toLowerCase() === creada.nombre.toLowerCase()
      );

      if (!yaExiste) {
        setTodasLasCategorias((prev) => [...prev, creada]);
      }

      setCategoriaSeleccionada(creada.nombre);
      setIconoSeleccionado(creada.icono || nuevaCategoriaEmoji);
      setNuevaCategoriaNombre("");
      setMostrarNuevaCategoria(false);
      setErrorVisual("");
    } catch (error) {
      setErrorVisual(error.message || "No se pudo agregar la categoría.");
    }
  };

  const guardar = async () => {
    setErrorVisual("");

    if (
      !titulo.trim() ||
      !monto.trim() ||
      isNaN(Number(monto)) ||
      Number(monto) <= 0
    ) {
      setErrorVisual(
        "Ingrese un concepto válido y un monto numérico mayor a 0."
      );
      return;
    }

    try {
      setCargando(true);
      await crearMovimiento({
        titulo: titulo.trim(),
        monto: Number(monto),
        categoria: categoriaSeleccionada || "General",
        icono: iconoSeleccionado,
        tipo,
        fecha: fecha.trim() || "Hoy",
        descripcion: descripcion.trim() || "Registro manual en la app.",
      });
      navigation.navigate("Dashboard");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el movimiento.");
    } finally {
      setCargando(false);
    }
  };

  const emojisOpciones = tipo === "Ingreso" ? EMOJIS_INGRESO : EMOJIS_GASTO;

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
          <Text style={styles.title}>Nuevo Movimiento</Text>
        </View>

        <View style={styles.toggleTrack}>
          <Pressable
            style={[
              styles.toggleBtn,
              tipo === "Gasto" && styles.toggleGastoActive,
            ]}
            onPress={() => cambiarTipo("Gasto")}
          >
            <Text
              style={[
                styles.toggleText,
                tipo === "Gasto" && styles.toggleTextActive,
              ]}
            >
              ⬇️ Gasto (Egreso)
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleBtn,
              tipo === "Ingreso" && styles.toggleIngresoActive,
            ]}
            onPress={() => cambiarTipo("Ingreso")}
          >
            <Text
              style={[
                styles.toggleText,
                tipo === "Ingreso" && styles.toggleTextActive,
              ]}
            >
              ⬆️ Ingreso
            </Text>
          </Pressable>
        </View>

        {errorVisual ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorVisual}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Concepto / Título</Text>
        <TextInput
          style={styles.input}
          placeholder={
            tipo === "Gasto"
              ? "Ej. Compra supermercado, Pago luz..."
              : "Ej. Pago quincena, Proyecto freelance..."
          }
          placeholderTextColor="#9CA3AF"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Monto (COP)</Text>
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="150000"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />

        <View style={styles.catHeaderRow}>
          <Text style={styles.label}>
            Categorías de {tipo === "Ingreso" ? "Ingresos" : "Gastos"}
          </Text>
          <Pressable
            onPress={() => setMostrarNuevaCategoria(!mostrarNuevaCategoria)}
          >
            <Text
              style={[
                styles.addCatLink,
                tipo === "Gasto" && { color: "#DC2626" },
              ]}
            >
              {mostrarNuevaCategoria
                ? "Cancelar"
                : `+ Nueva categoría de ${tipo}`}
            </Text>
          </Pressable>
        </View>

        <View style={styles.categoriesGrid}>
          {categoriasDelTipoActual.map((cat) => {
            const activa = categoriaSeleccionada === cat.nombre;
            return (
              <Pressable
                key={`${cat.tipo}-${cat.nombre}`}
                style={[
                  styles.categoryChip,
                  activa &&
                    (tipo === "Ingreso"
                      ? styles.categoryChipActiveIngreso
                      : styles.categoryChipActiveGasto),
                ]}
                onPress={() => seleccionarCategoria(cat)}
              >
                <Text style={styles.categoryChipEmoji}>{cat.icono}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    activa && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.nombre}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {mostrarNuevaCategoria ? (
          <View
            style={[
              styles.newCategoryBox,
              tipo === "Gasto" && { borderColor: "#FECACA" },
            ]}
          >
            <Text style={styles.newCategoryTitle}>
              Agregar Categoría Personalizada ({tipo})
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                tipo === "Gasto"
                  ? "Ej. Mascotas, Gimnasio, Suscripciones..."
                  : "Ej. Dividendos, Arriendos, Bonificación..."
              }
              placeholderTextColor="#9CA3AF"
              value={nuevaCategoriaNombre}
              onChangeText={setNuevaCategoriaNombre}
            />
            <Text style={styles.emojiSelectorLabel}>Elige un icono:</Text>
            <View style={styles.emojiRow}>
              {emojisOpciones.map((em) => (
                <Pressable
                  key={em}
                  style={[
                    styles.emojiOption,
                    nuevaCategoriaEmoji === em && styles.emojiOptionActive,
                  ]}
                  onPress={() => setNuevaCategoriaEmoji(em)}
                >
                  <Text style={styles.emojiOptionText}>{em}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={[
                styles.addCategoryConfirmBtn,
                tipo === "Gasto" && { backgroundColor: "#EF4444" },
              ]}
              onPress={handleCrearCategoria}
            >
              <Text style={styles.addCategoryConfirmText}>
                Guardar Categoría de {tipo}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="Ej. 17 Oct 2026"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Descripción / Nota</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
          placeholder="Detalle opcional..."
          placeholderTextColor="#9CA3AF"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#059669"
            style={{ marginTop: 24 }}
          />
        ) : (
          <Pressable
            style={[
              styles.saveBtn,
              tipo === "Gasto" && { backgroundColor: "#EF4444" },
            ]}
            onPress={guardar}
          >
            <Text style={styles.saveBtnText}>Guardar {tipo}</Text>
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
  toggleTrack: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginVertical: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleGastoActive: { backgroundColor: "#EF4444" },
  toggleIngresoActive: { backgroundColor: "#059669" },
  toggleText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  toggleTextActive: { color: "#FFFFFF" },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: { color: "#B91C1C", fontSize: 12, fontWeight: "600" },
  label: { fontSize: 13, color: "#4B5563", marginBottom: 6, marginTop: 10 },
  catHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  addCatLink: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipActiveGasto: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  categoryChipActiveIngreso: {
    backgroundColor: "#D1FAE5",
    borderColor: "#059669",
  },
  categoryChipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  categoryChipTextActive: {
    fontWeight: "700",
    color: "#111827",
  },
  newCategoryBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  newCategoryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emojiSelectorLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 6,
  },
  emojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  emojiOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  emojiOptionActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#059669",
  },
  emojiOptionText: { fontSize: 16 },
  addCategoryConfirmBtn: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  addCategoryConfirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  amountInput: { fontSize: 20, fontWeight: "600" },
  textArea: { height: 70, textAlignVertical: "top" },
  saveBtn: {
    height: 52,
    backgroundColor: "#059669",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
});
