import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import AddMeasurementScreen from './src/screens/AddMeasurementScreen';
import EstimateScreen from './src/screens/EstimateScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F4F6F8',
    card: '#FFFFFF',
    text: '#15202B',
    border: '#D9E2EC',
    primary: '#0F766E',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="AddMeasurement" component={AddMeasurementScreen} />
        <Stack.Screen name="Estimate" component={EstimateScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
