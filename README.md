# 📱 MiFinancista - Aplicación Móvil (React Native & Expo)

Aplicación móvil moderna de finanzas personales desarrollada en **React Native** con el ecosistema **Expo (SDK 58)** y **React Navigation**. Permite a los usuarios llevar el control de sus ingresos, gastos, presupuestos y reportes con una interfaz fluida e intuitiva, conectada en tiempo real a un backend de alto rendimiento desarrollado en **Ktor (Kotlin)** y **Firebase**.

---

## 🌟 Características Principales

- **Autenticación Estricta**:
  - Registro de nuevos usuarios con validación de campos y contraseñas.
  - Inicio de sesión con verificación rigurosa de credenciales contra el backend (sin autocreación accidental de cuentas).
  - Usuario de prueba precargado (`demo@mifinancista.com` / `password123`) para acceso rápido con 10 transacciones reales de demostración.
- **Gestión Completa de Transacciones (CRUD)**:
  - **Crear**: Registro de ingresos y gastos con concepto, monto, categoría, ícono y notas.
  - **Ver Detalle**: Tarjeta detallada con insignias por tipo de movimiento, fecha formateada y notas.
  - **Editar Movimiento**: Pantalla completa `EditTransactionScreen` para actualizar concepto, monto, fecha, notas y categorías.
  - **Eliminar**: Borrado seguro con confirmación de alerta nativa.
- **Categorías Dinámicas y Personalizadas**:
  - Categorías predefinidas para gastos e ingresos.
  - Selector de emojis interactivo para crear categorías personalizadas por usuario.
- **Reportes y Estadísticas Financieras**:
  - Gráficos y desglose porcentual por categorías de gastos e ingresos.
  - Indicadores clave de rendimiento (KPIs), ahorro neto y tasa de ahorro.
- **Historial y Filtros Avanzados**:
  - Búsqueda en tiempo real por concepto, categoría o notas.
  - Filtro por tipo (Todos, Ingresos, Gastos) y por categorías individuales.
- **Soporte Multiplataforma**:
  - Optimizado para **iOS** (con soporte completo de Safe Area y Dynamic Island) y **Android**.
  - Compatible al 100% con **Web** (`npx expo start --web`).

---

## 🗂️ Estructura del Proyecto

```text
MiFinancista/
├── assets/                    # Íconos, splash screens y recursos visuales
├── components/                # Componentes reutilizables
│   ├── BottomNav.js           # Barra de navegación inferior
│   ├── DynamicIsland.js       # Componente de estado
│   └── MovimientoCard.js      # Tarjeta interactiva de transacción
├── context/                   # Contexto global de estado
│   └── AuthContext.js         # Estado global de sesión y usuario autenticado
├── navigation/                # Configuración de rutas
│   └── AppNavigator.js        # Stack Navigator nativo con todas las pantallas
├── screens/                   # Pantallas de la aplicación
│   ├── AddTransactionScreen.js    # Registro de nuevo ingreso/gasto
│   ├── DashboardScreen.js         # Vista principal y balance general
│   ├── EditTransactionScreen.js   # Edición completa de movimientos
│   ├── HistorialScreen.js         # Histórico con búsqueda y filtros
│   ├── LoginScreen.js             # Inicio de sesión estricto
│   ├── MovementDetailScreen.js    # Detalle y acciones de transacción
│   ├── PerfilScreen.js            # Perfil de usuario y cierre de sesión
│   ├── RegisterScreen.js          # Registro de nuevos usuarios
│   ├── ReportsScreen.js           # Reportes, gráficos y métricas
│   └── SplashScreen.js            # Pantalla de bienvenida con logo centrado
├── services/                  # Capa de servicios y comunicación API
│   ├── api.js                 # Cliente HTTP con soporte Ktor y modo mock offline
│   ├── authService.js         # Servicios de autenticación (Login/Register)
│   ├── authStorage.js         # Persistencia segura de tokens y sesión
│   └── movimientoService.js   # Servicios de transacciones y categorías
├── app.json                   # Configuración del proyecto Expo
├── package.json               # Dependencias y scripts de ejecución
└── README.md                  # Documentación del proyecto
```

---

## 🚀 Requisitos Previos

- **Node.js**: Versión 18 o superior recomendada.
- **Expo Go**: Aplicación móvil instalada en tu dispositivo iOS o Android (disponible en App Store y Google Play).
- **Backend Ktor**: Servidor `MiFinancistaBackend` ejecutándose en el puerto `8080`.

---

## 📦 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/MiFinancista.git
   cd MiFinancista
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar la IP del backend**:
   Abre el archivo `services/api.js` y actualiza la constante `LAN_IP` con la dirección IP local de tu computador en la red Wi-Fi (puedes consultarla con `ipconfig` en Windows o `ifconfig` en Mac/Linux):
   ```javascript
   // services/api.js
   const LAN_IP = "192.168.1.2"; // Cambia por la IP de tu PC
   ```

---

## 💻 Ejecución

### En dispositivo móvil físico (iOS / Android)
```bash
npx expo start
```
Escanea el código QR mostrado en la terminal con la cámara de tu iPhone o con la app Expo Go en Android.

### En navegador Web
```bash
npx expo start --web
```
Se abrirá automáticamente en `http://localhost:8081`.

---

## 🧪 Credenciales de Demostración

Para probar la aplicación inmediatamente sin registrar un nuevo usuario:
- **Correo**: `demo@mifinancista.com`
- **Contraseña**: `password123`

*(En la pantalla de Login puedes presionar el botón "Usar Demo" para rellenar las credenciales automáticamente).*

---

## 🔗 Integración con el Backend
La aplicación consume la API RESTful de **MiFinancistaBackend (Ktor)** con autenticación vía Bearer JWT en los siguientes endpoints:
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro
- `GET /api/movimientos` - Listado de movimientos del usuario
- `POST /api/movimientos` - Creación de movimiento
- `PUT /api/movimientos/{id}` - Edición de movimiento
- `DELETE /api/movimientos/{id}` - Eliminación de movimiento
- `GET /api/categorias` y `POST /api/categorias` - Gestión de categorías
