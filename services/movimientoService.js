import api from "./api";

export const CATEGORIAS_GASTO_DEFAULT = [
  { nombre: "Alimentación", icono: "🍔", tipo: "Gasto" },
  { nombre: "Transporte", icono: "🚌", tipo: "Gasto" },
  { nombre: "Servicios", icono: "🌐", tipo: "Gasto" },
  { nombre: "Vivienda", icono: "🏠", tipo: "Gasto" },
  { nombre: "Salud", icono: "💊", tipo: "Gasto" },
  { nombre: "Ocio", icono: "🎮", tipo: "Gasto" },
  { nombre: "Educación", icono: "📚", tipo: "Gasto" },
];

export const CATEGORIAS_INGRESO_DEFAULT = [
  { nombre: "Salario", icono: "💼", tipo: "Ingreso" },
  { nombre: "Honorarios", icono: "💻", tipo: "Ingreso" },
  { nombre: "Inversiones", icono: "📈", tipo: "Ingreso" },
  { nombre: "Ventas", icono: "🏷️", tipo: "Ingreso" },
  { nombre: "Regalos", icono: "🎁", tipo: "Ingreso" },
];

export const CATEGORIAS_PREDETERMINADAS = [
  ...CATEGORIAS_GASTO_DEFAULT,
  ...CATEGORIAS_INGRESO_DEFAULT,
];

export const obtenerMovimientos = async () => {
  return await api("/movimientos");
};

export const obtenerMovimiento = async (id) => {
  return await api(`/movimientos/${id}`);
};

export const crearMovimiento = async (movimiento) => {
  return await api("/movimientos", {
    method: "POST",
    body: JSON.stringify(movimiento),
  });
};

export const actualizarMovimiento = async (id, movimiento) => {
  return await api(`/movimientos/${id}`, {
    method: "PUT",
    body: JSON.stringify(movimiento),
  });
};

export const eliminarMovimiento = async (id) => {
  return await api(`/movimientos/${id}`, {
    method: "DELETE",
  });
};

export const obtenerCategoriasUsuario = async () => {
  const personalizadas = await api("/categorias");
  const clavesBase = new Set(
    CATEGORIAS_PREDETERMINADAS.map(
      (c) => `${c.tipo}:${c.nombre.toLowerCase()}`
    )
  );
  const extras = (personalizadas || []).filter(
    (c) => !clavesBase.has(`${c.tipo}:${c.nombre.toLowerCase()}`)
  );
  return [...CATEGORIAS_PREDETERMINADAS, ...extras];
};

export const agregarCategoriaUsuario = async (
  nombre,
  icono = "🏷️",
  tipo = "Gasto"
) => {
  return await api("/categorias", {
    method: "POST",
    body: JSON.stringify({ nombre, icono, tipo }),
  });
};
