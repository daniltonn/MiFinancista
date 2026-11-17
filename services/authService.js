import api from "./api";

export const iniciarSesion = async (correo, password) => {
  return await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
};

export const registrarUsuario = async (nombre, correo, password) => {
  return await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nombre, correo, password }),
  });
};

export const obtenerPerfilUsuario = async () => {
  return await api("/auth/perfil", {
    method: "GET",
  });
};
