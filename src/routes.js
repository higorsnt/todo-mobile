import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerScreen from './screens/DrawerScreen';
import Auth from './screens/Auth';
import AuthOrApp from './screens/AuthOrApp';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={AuthOrApp} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={DrawerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
