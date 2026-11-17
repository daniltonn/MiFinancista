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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  actualizarMovimiento,
  CATEGORIAS_PREDETERMINADAS,
  CATEGORIAS_GASTO_DEFAULT,
  CATEGORIAS_INGRESO_DEFAULT,
  obtenerCategoriasUsuario,
  agregarCategoriaUsuario,
} from "../services/movimientoService";

const EMOJIS_GASTO = ["🏷️", "🛒", "🍔", "🚌", "🏠", "💊", "🎮", "📱", "💡"];
const EMOJIS_INGRESO = ["💰", "💼", "💻", "📈", "🎁", "🏦", "💵", "🏆", "✨"];

export default function EditTransactionScreen({ route, navigation }) {
  const movimientoInicial = route.params?.movimiento || {};

  const [tipo, setTipo] = useState(movimientoInicial.tipo || "Gasto");
  const [titulo, setTitulo] = useState(movimientoInicial.titulo || "");
  const [monto, setMonto] = useState(
    movimientoInicial.monto !== undefined ? String(movimientoInicial.monto) : ""
  );
  const [todasLasCategorias, setTodasLasCategorias] = useState(
    CATEGORIAS_PREDETERMINADAS
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    movimientoInicial.categoria || "General"
  );
  const [iconoSeleccionado, setIconoSeleccionado] = useState(
    movimientoInicial.icono || "🏷️"
  );
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState("");
  const [nuevaCategoriaEmoji, setNuevaCategoriaEmoji] = useState("🏷️");
  const [fecha, setFecha] = useState(movimientoInicial.fecha || "");
  const [descripcion, setDescripcion] = useState(
    movimientoInicial.descripcion || ""
  );
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

  const guardarCambios = async () => {
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
      const datosActualizados = {
        titulo: titulo.trim(),
        monto: Number(monto),
        categoria: categoriaSeleccionada || "General",
        icono: iconoSeleccionado,
        tipo,
        fecha: fecha.trim() || movimientoInicial.fecha || "Hoy",
        descripcion: descripcion.trim(),
      };

      const respuesta = await actualizarMovimiento(
        movimientoInicial.id,
        datosActualizados
      );

      const movimientoFinal = {
        ...movimientoInicial,
        ...(respuesta || datosActualizados),
      };

      if (Platform.OS === "web") {
        navigation.navigate("MovementDetail", {
          movimiento: movimientoFinal,
        });
      } else {
        Alert.alert(
          "Movimiento Actualizado",
          "Los cambios se han guardado con éxito.",
          [
            {
              text: "Aceptar",
              onPress: () => {
                navigation.navigate("MovementDetail", {
                  movimiento: movimientoFinal,
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error al guardar",
        error.message || "No se pudo actualizar el movimiento."
      );
    } finally {
      setCargando(false);
    }
  };

  const emojisOpciones = tipo === "Ingreso" ? EMOJIS_INGRESO : EMOJIS_GASTO;
  const esGasto = tipo === "Gasto";

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
          <Text style={styles.title}>Editar Movimiento</Text>
        </View>

        <View style={styles.toggleTrack}>
          <Pressable
            style={[
              styles.toggleBtn,
              esGasto && styles.toggleGastoActive,
            ]}
            onPress={() => cambiarTipo("Gasto")}
          >
            <Text
              style={[
                styles.toggleText,
                esGasto && styles.toggleTextActive,
              ]}
            >
              ⬇️ Gasto (Egreso)
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleBtn,
              !esGasto && styles.toggleIngresoActive,
            ]}
            onPress={() => cambiarTipo("Ingreso")}
          >
            <Text
              style={[
                styles.toggleText,
                !esGasto && styles.toggleTextActive,
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
          placeholder="Ej. Compra supermercado, Pago quincena..."
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
                esGasto && { color: "#DC2626" },
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
                    (!esGasto
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
              esGasto && { borderColor: "#FECACA" },
            ]}
          >
            <Text style={styles.newCategoryTitle}>
              Agregar Categoría Personalizada ({tipo})
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                esGasto
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
                esGasto && { backgroundColor: "#EF4444" },
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
          placeholder="Ej. 17 Oct 2026, 10:00 AM"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Descripción / Nota</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
          placeholder="Detalle o nota del movimiento..."
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
              esGasto && { backgroundColor: "#EF4444" },
            ]}
            onPress={guardarCambios}
          >
            <Text style={styles.saveBtnText}>Guardar Cambios</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </Pressable>
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
  title: { fontSize: 20, fontWeight: "600", color: "#111827" },
  toggleTrack: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleGastoActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIngresoActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  toggleTextActive: { color: "#111827", fontWeight: "600" },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#111827",
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  catHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  addCatLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
  newCategoryBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    padding: 12,
    marginBottom: 14,
  },
  newCategoryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emojiSelectorLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  emojiOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emojiOptionActive: {
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
  },
  emojiOptionText: {
    fontSize: 16,
  },
  addCategoryConfirmBtn: {
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  addCategoryConfirmText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: "#059669",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelBtnText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});
