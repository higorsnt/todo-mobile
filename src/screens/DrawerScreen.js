import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import commonStyles from '../commonStyles';
import Agenda from './Agenda';
import Menu from '../components/Menu';

const Drawer = createDrawerNavigator();

export default function DrawerScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Today"
      drawerContent={(props) => <Menu {...props} />}
      drawerContentOptions={{
        labelStyle: {
          fontFamily: commonStyles.fontFamily,
          fontWeight: 'bold',
          fontSize: 20,
        },
        activeTintColor: '#5172C0',
      }}
    >
      <Drawer.Screen
        name="Today"
        component={Agenda}
        initialParams={{ title: 'Hoje', daysAhead: 0 }}
        options={{
          title: 'Hoje',
        }}
      />
      <Drawer.Screen
        name="Tomorrow"
        component={Agenda}
        initialParams={{ title: 'Amanhã', daysAhead: 1 }}
        options={{
          title: 'Amanhã',
        }}
      />
      <Drawer.Screen
        name="Semana"
        component={Agenda}
        initialParams={{ title: 'Semana', daysAhead: 7 }}
        options={{
          title: 'Semana',
        }}
      />
      <Drawer.Screen
        name="Month"
        component={Agenda}
        initialParams={{ title: 'Mês', daysAhead: 30 }}
        options={{
          title: 'Mês',
        }}
      />
    </Drawer.Navigator>
  );
}
