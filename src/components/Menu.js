import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gravatar } from 'react-native-gravatar';
import {
  DrawerItemList,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import api from '../service/api';
import commonStyles from '../commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Menu(props) {
  const navigation = useNavigation();
  const route = useRoute();

  function logout() {
    delete api.defaults.headers.common['Authorization'];
    AsyncStorage.clear();
    navigation.navigate('Loading');
  }

  return (
    <DrawerContentScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>todo</Text>
        <Gravatar
          style={styles.avatar}
          options={{ email: route.params.email, secure: true }}
        />
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.name}>{route.params.name}</Text>
            <Text style={styles.email}>{route.params.email}</Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <View style={styles.logoutIcon}>
              <Icon name="sign-out" size={30} color="#800" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  title: {
    backgroundColor: '#FFF',
    color: '#000',
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    paddingTop: 30,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: '#AAA',
    borderRadius: 30,
    margin: 10,
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 20,
    marginLeft: 10,
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 10,
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});
