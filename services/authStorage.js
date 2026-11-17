import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "mifinancista_token";
const USER_KEY = "mifinancista_usuario_actual";

export const guardarToken = async (token) => {
  if (!token) return;
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const obtenerToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const eliminarToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

export const guardarUsuarioActual = async (usuario) => {
  if (!usuario) return;
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const obtenerUsuarioActual = async () => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};
