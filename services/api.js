import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerToken, obtenerUsuarioActual } from "./authStorage";

// IP de red local de tu máquina para que tu celular con Expo Go pueda conectarse al backend Ktor
const LAN_IP = "192.168.1.2";

// En Web se usa localhost; en celular físico o emulador se conecta a la IP de tu PC en la red Wi-Fi:
const BASE_HOST = Platform.OS === "web" ? "http://localhost:8080" : `http://${LAN_IP}:8080`;
export const API_URL = `${BASE_HOST}/api`;

// Cambia a true solo si deseas operar 100% offline sin el servidor Ktor
export const USE_MOCK_API = false;

const DB_USERS_KEY = "mifinancista_db_usuarios_v3";
const DB_MOVIMIENTOS_KEY = "mifinancista_db_movimientos_v3";
const DB_CATEGORIAS_KEY = "mifinancista_db_categorias_v3";

export const USUARIO_PRUEBA_DEFAULT = {
  id: "usr-demo-2026",
  nombre: "Carlos Andrés (Usuario Demo)",
  correo: "demo@mifinancista.com",
  password: "password123",
  rol: "Cuenta Demo Precargada",
  fechaRegistro: "01 Oct 2026",
};

export const MOVIMIENTOS_PRECARGADOS_DEMO = [
  {
    id: 101,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Salario Mensual Octubre",
    categoria: "Salario",
    icono: "💼",
    monto: 4200000,
    tipo: "Ingreso",
    fecha: "15 Oct 2026, 9:00 AM",
    descripcion: "Pago de nómina quincenal y prestaciones de ley.",
  },
  {
    id: 102,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Arriendo Apartamento",
    categoria: "Vivienda",
    icono: "🏠",
    monto: 1350000,
    tipo: "Gasto",
    fecha: "15 Oct 2026, 11:30 AM",
    descripcion: "Pago mensual de canon de arrendamiento y administración.",
  },
  {
    id: 103,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Consultoría Desarrollo Web",
    categoria: "Honorarios",
    icono: "💻",
    monto: 950000,
    tipo: "Ingreso",
    fecha: "14 Oct 2026, 4:45 PM",
    descripcion: "Pago por soporte técnico y optimización de plataforma.",
  },
  {
    id: 104,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Mercado Mensual Supermercado",
    categoria: "Alimentación",
    icono: "🍔",
    monto: 485000,
    tipo: "Gasto",
    fecha: "13 Oct 2026, 6:20 PM",
    descripcion: "Compra de víveres, frutas, verduras y aseo para el hogar.",
  },
  {
    id: 105,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Rendimientos CDT y Fondos",
    categoria: "Inversiones",
    icono: "📈",
    monto: 320000,
    tipo: "Ingreso",
    fecha: "12 Oct 2026, 2:10 PM",
    descripcion: "Abono de dividendos y rendimientos financieros del mes.",
  },
  {
    id: 106,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Fibra Óptica y Energía Eléctrica",
    categoria: "Servicios",
    icono: "🌐",
    monto: 245000,
    tipo: "Gasto",
    fecha: "11 Oct 2026, 10:15 AM",
    descripcion: "Pago de facturas de servicios públicos e internet hogar.",
  },
  {
    id: 107,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Venta Monitor Usado",
    categoria: "Ventas",
    icono: "🏷️",
    monto: 410000,
    tipo: "Ingreso",
    fecha: "10 Oct 2026, 3:40 PM",
    descripcion: "Venta de pantalla secundaria de oficina en buen estado.",
  },
  {
    id: 108,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Combustible y Recarga Transporte",
    categoria: "Transporte",
    icono: "🚌",
    monto: 165000,
    tipo: "Gasto",
    fecha: "09 Oct 2026, 8:00 AM",
    descripcion: "Tanqueada mensual y recarga de tarjeta de transporte.",
  },
  {
    id: 109,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Control Médico y Farmacia",
    categoria: "Salud",
    icono: "💊",
    monto: 120000,
    tipo: "Gasto",
    fecha: "08 Oct 2026, 5:15 PM",
    descripcion: "Copago cita médica especialista y vitaminas.",
  },
  {
    id: 110,
    usuarioCorreo: "demo@mifinancista.com",
    titulo: "Cine y Cena Fin de Semana",
    categoria: "Ocio",
    icono: "🎮",
    monto: 98000,
    tipo: "Gasto",
    fecha: "06 Oct 2026, 8:30 PM",
    descripcion: "Salida familiar de fin de semana y suscripción streaming.",
  },
];

export const ICONOS_CATEGORIA = {
  // Categorías de Gasto
  Alimentación: "🍔",
  Transporte: "🚌",
  Servicios: "🌐",
  Vivienda: "🏠",
  Salud: "💊",
  Ocio: "🎮",
  Educación: "📚",
  // Categorías de Ingreso
  Salario: "💼",
  Honorarios: "💻",
  Inversiones: "📈",
  Ventas: "🏷️",
  Regalos: "🎁",
  General: "💲",
};

export const obtenerIconoPorCategoria = (categoria, tipo = "Gasto") => {
  if (ICONOS_CATEGORIA[categoria]) {
    return ICONOS_CATEGORIA[categoria];
  }
  return tipo === "Ingreso" ? "💰" : "💸";
};

const normalizarCorreo = (correo = "") => correo.trim().toLowerCase();

const inicializarDatosSemilla = async () => {
  try {
    const rawUsers = await AsyncStorage.getItem(DB_USERS_KEY);
    let usuarios = rawUsers ? JSON.parse(rawUsers) : {};
    const correoDemo = normalizarCorreo(USUARIO_PRUEBA_DEFAULT.correo);

    if (!usuarios[correoDemo]) {
      usuarios[correoDemo] = { ...USUARIO_PRUEBA_DEFAULT };
      await AsyncStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));
    }

    const rawMovs = await AsyncStorage.getItem(DB_MOVIMIENTOS_KEY);
    let movimientosDB = rawMovs ? JSON.parse(rawMovs) : {};

    if (
      !Array.isArray(movimientosDB[correoDemo]) ||
      movimientosDB[correoDemo].length === 0
    ) {
      movimientosDB[correoDemo] = [...MOVIMIENTOS_PRECARGADOS_DEMO];
      await AsyncStorage.setItem(
        DB_MOVIMIENTOS_KEY,
        JSON.stringify(movimientosDB)
      );
    }

    return { usuarios, movimientosDB };
  } catch (error) {
    return {
      usuarios: {
        [USUARIO_PRUEBA_DEFAULT.correo]: { ...USUARIO_PRUEBA_DEFAULT },
      },
      movimientosDB: {
        [USUARIO_PRUEBA_DEFAULT.correo]: [...MOVIMIENTOS_PRECARGADOS_DEMO],
      },
    };
  }
};

const guardarUsuariosDB = async (usuarios) => {
  await AsyncStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));
};

const guardarMovimientosDB = async (movimientosPorUsuario) => {
  await AsyncStorage.setItem(
    DB_MOVIMIENTOS_KEY,
    JSON.stringify(movimientosPorUsuario)
  );
};

const leerCategoriasDB = async () => {
  try {
    const raw = await AsyncStorage.getItem(DB_CATEGORIAS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
};

const guardarCategoriasDB = async (categoriasPorUsuario) => {
  await AsyncStorage.setItem(
    DB_CATEGORIAS_KEY,
    JSON.stringify(categoriasPorUsuario)
  );
};

const extraerCorreoDesdeToken = async (authHeader) => {
  if (authHeader && authHeader.startsWith("Bearer jwt-mock-token::")) {
    return normalizarCorreo(authHeader.replace("Bearer jwt-mock-token::", ""));
  }
  const usuario = await obtenerUsuarioActual();
  if (usuario && usuario.correo) {
    return normalizarCorreo(usuario.correo);
  }
  return normalizarCorreo(USUARIO_PRUEBA_DEFAULT.correo);
};

const simularRed = (ms = 220) => new Promise((res) => setTimeout(res, ms));

const api = async (endpoint, options = {}) => {
  const token = await obtenerToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (USE_MOCK_API) {
    await simularRed(220);
    const { usuarios, movimientosDB } = await inicializarDatosSemilla();
    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body) : null;

    // LOGIN ESTRICTO: Solo permite usuarios existentes en la base de datos y con contraseña exacta
    if (endpoint === "/auth/login" && method === "POST") {
      const correoLimpio = normalizarCorreo(body?.correo);
      const password = body?.password || "";

      const usuarioRegistrado = usuarios[correoLimpio];

      if (!usuarioRegistrado) {
        throw new Error(
          "La cuenta no existe. Verifique su correo electrónico o regístrese primero."
        );
      }

      if (usuarioRegistrado.password !== password) {
        throw new Error(
          "Credenciales incorrectas. La contraseña ingresada no coincide."
        );
      }

      const { password: _, ...usuarioPublico } = usuarioRegistrado;
      return {
        token: `jwt-mock-token::${correoLimpio}`,
        usuario: usuarioPublico,
      };
    }

    // REGISTRO DE NUEVOS USUARIOS
    if (endpoint === "/auth/register" && method === "POST") {
      const correoLimpio = normalizarCorreo(body?.correo);
      const nombreLimpio = (body?.nombre || "").trim();
      const password = body?.password || "";

      if (!nombreLimpio || !correoLimpio || password.length < 4) {
        throw new Error(
          "Complete todos los campos correctamente (contraseña mínimo 4 caracteres)."
        );
      }

      if (usuarios[correoLimpio]) {
        throw new Error(
          "Ya existe una cuenta registrada con este correo electrónico."
        );
      }

      const nuevoUsuario = {
        id: `usr-${Date.now()}`,
        nombre: nombreLimpio,
        correo: correoLimpio,
        password,
        rol: "Cuenta Personal",
        fechaRegistro: new Date().toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      usuarios[correoLimpio] = nuevoUsuario;
      await guardarUsuariosDB(usuarios);

      if (!movimientosDB[correoLimpio]) {
        movimientosDB[correoLimpio] = [];
        await guardarMovimientosDB(movimientosDB);
      }

      const { password: _, ...usuarioPublico } = nuevoUsuario;
      return {
        token: `jwt-mock-token::${correoLimpio}`,
        usuario: usuarioPublico,
      };
    }

    const correoUsuario = await extraerCorreoDesdeToken(headers.Authorization);

    if (endpoint === "/auth/perfil" && method === "GET") {
      const encontrado =
        usuarios[correoUsuario] || usuarios[USUARIO_PRUEBA_DEFAULT.correo];
      const { password: _, ...usuarioPublico } = encontrado;
      return usuarioPublico;
    }

    if (endpoint === "/movimientos" && method === "GET") {
      const listaUsuario = movimientosDB[correoUsuario] || [];
      return [...listaUsuario];
    }

    if (endpoint.startsWith("/movimientos/") && method === "GET") {
      const id = Number(endpoint.split("/")[2]);
      const listaUsuario = movimientosDB[correoUsuario] || [];
      const encontrado = listaUsuario.find((m) => Number(m.id) === id);
      if (!encontrado) {
        throw new Error("Movimiento no encontrado.");
      }
      return encontrado;
    }

    if (endpoint === "/movimientos" && method === "POST") {
      const listaUsuario = movimientosDB[correoUsuario] || [];
      const categoriaElegida = body.categoria || "General";
      const tipoElegido = body.tipo || "Gasto";

      const nuevo = {
        id: Date.now(),
        usuarioCorreo: correoUsuario,
        titulo: body.titulo || categoriaElegida,
        categoria: categoriaElegida,
        icono:
          body.icono || obtenerIconoPorCategoria(categoriaElegida, tipoElegido),
        monto: Number(body.monto) || 0,
        tipo: tipoElegido,
        fecha:
          body.fecha ||
          new Date().toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        descripcion: body.descripcion || "Sin descripción adicional.",
      };

      movimientosDB[correoUsuario] = [nuevo, ...listaUsuario];
      await guardarMovimientosDB(movimientosDB);
      return nuevo;
    }

    if (endpoint.startsWith("/movimientos/") && method === "PUT") {
      const id = Number(endpoint.split("/")[2]);
      const listaUsuario = movimientosDB[correoUsuario] || [];
      const index = listaUsuario.findIndex((m) => Number(m.id) === id);

      if (index === -1) {
        throw new Error("El movimiento no existe.");
      }

      const actualizado = {
        ...listaUsuario[index],
        ...body,
        monto:
          body.monto !== undefined
            ? Number(body.monto)
            : listaUsuario[index].monto,
        icono:
          body.icono ||
          obtenerIconoPorCategoria(
            body.categoria || listaUsuario[index].categoria,
            body.tipo || listaUsuario[index].tipo
          ),
      };

      listaUsuario[index] = actualizado;
      movimientosDB[correoUsuario] = listaUsuario;
      await guardarMovimientosDB(movimientosDB);
      return actualizado;
    }

    if (endpoint.startsWith("/movimientos/") && method === "DELETE") {
      const id = Number(endpoint.split("/")[2]);
      const listaUsuario = movimientosDB[correoUsuario] || [];
      movimientosDB[correoUsuario] = listaUsuario.filter(
        (m) => Number(m.id) !== id
      );
      await guardarMovimientosDB(movimientosDB);
      return { success: true };
    }

    if (endpoint === "/categorias" && method === "GET") {
      const categoriasDB = await leerCategoriasDB();
      return categoriasDB[correoUsuario] || [];
    }

    if (endpoint === "/categorias" && method === "POST") {
      const nombreCat = (body?.nombre || "").trim();
      const tipoCat = body?.tipo || "Gasto";
      if (!nombreCat) {
        throw new Error("El nombre de la categoría no puede estar vacío.");
      }

      const categoriasDB = await leerCategoriasDB();
      const actuales = categoriasDB[correoUsuario] || [];
      const existente = actuales.find(
        (c) =>
          c.nombre.toLowerCase() === nombreCat.toLowerCase() &&
          c.tipo === tipoCat
      );

      if (existente) {
        return existente;
      }

      const nuevaCat = {
        id: Date.now().toString(),
        nombre: nombreCat,
        icono: body?.icono || (tipoCat === "Ingreso" ? "💰" : "🏷️"),
        tipo: tipoCat,
        personalizada: true,
      };
      categoriasDB[correoUsuario] = [...actuales, nuevaCat];
      await guardarCategoriasDB(categoriasDB);
      return nuevaCat;
    }
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    console.error("Error de conexión con el backend:", networkError);
    throw new Error(
      `No se pudo conectar con el servidor backend en ${API_URL}. Asegúrate de que el backend Ktor esté encendido.`
    );
  }

  if (!response.ok) {
    let mensaje = `Error HTTP: ${response.status}`;
    try {
      const data = await response.json();
      if (data.message) {
        mensaje = data.message;
      }
    } catch (error) {}
    throw new Error(mensaje);
  }

  return response.json();
};

export default api;
