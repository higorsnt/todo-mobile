import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

import api from '../service/api';

export default function AuthOrApp() {
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(json) || {};

      if (userData.token) {
        api.defaults.headers.common[
          'Authorization'
        ] = `bearer ${userData.token}`;

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: userData }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    })();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
