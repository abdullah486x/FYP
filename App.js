import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import { ScriptProvider } from './src/context/ScriptContext';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';
import TeleprompterScreen from './src/screens/TeleprompterScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ScriptProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'CamPrompter' }}
          />
          <Stack.Screen
            name="Editor"
            component={EditorScreen}
            options={{ title: 'Script Editor' }}
          />
          <Stack.Screen
            name="Teleprompter"
            component={TeleprompterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ScriptProvider>
  );
}
