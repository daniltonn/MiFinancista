import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import MovementDetailScreen from "../screens/MovementDetailScreen";
import ReportsScreen from "../screens/ReportsScreen";
import HistorialScreen from "../screens/HistorialScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 250,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ animation: "fade" }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="MovementDetail"
          component={MovementDetailScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="EditTransaction"
          component={EditTransactionScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Historial"
          component={HistorialScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
