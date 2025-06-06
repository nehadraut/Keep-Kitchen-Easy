import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/translations/i18n';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SubcategoryScreen from './src/screens/SubcategoryScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import BarcodeScreen from './src/screens/BarcodeScreen';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration will go here
  // You'll need to replace these with your actual Firebase project details
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChangedHandler(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {!user ? (
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ title: 'Kitchen Grocery System' }} 
              />
            ) : (
              <>
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ title: 'Kitchen Grocery System' }} 
                />
                <Stack.Screen 
                  name="Category" 
                  component={CategoryScreen} 
                  options={({ route }) => ({ title: route.params.category })} 
                />
                <Stack.Screen 
                  name="Subcategory" 
                  component={SubcategoryScreen} 
                  options={({ route }) => ({ title: route.params.subcategory })} 
                />
                <Stack.Screen 
                  name="AddItem" 
                  component={AddItemScreen} 
                  options={{ title: 'Add New Item' }} 
                />
                <Stack.Screen 
                  name="Barcode" 
                  component={BarcodeScreen} 
                  options={{ title: 'Scan Barcode' }} 
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </PaperProvider>
    </I18nextProvider>
  );
}