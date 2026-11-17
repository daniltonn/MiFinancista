import React, { createContext, useState, useEffect } from "react";
import {
  obtenerUsuarioActual,
  guardarUsuarioActual,
  guardarToken,
  eliminarToken,
} from "../services/authStorage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const usuarioGuardado = await obtenerUsuarioActual();
        if (usuarioGuardado) {
          setUsuario(usuarioGuardado);
        }
      } catch (error) {
        console.error("Error restaurando sesión:", error);
      } finally {
        setCargandoSesion(false);
      }
    };
    restaurarSesion();
  }, []);

  const establecerSesion = async (token, datosUsuario) => {
    await guardarToken(token);
    await guardarUsuarioActual(datosUsuario);
    setUsuario(datosUsuario);
  };

  const cerrarSesionContext = async () => {
    await eliminarToken();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        cargandoSesion,
        establecerSesion,
        cerrarSesionContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
