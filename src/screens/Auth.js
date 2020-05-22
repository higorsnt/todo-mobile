import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import showError from '../common';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput';
import api from '../service/api';

export default function Auth() {
  const [stageNew, setStageNew] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validForm, setValidForm] = useState(false);

  const navigation = useNavigation();

  useEffect(validations, [name, password, email, confirmPassword, stageNew]);

  function validations() {
    const validations = [];

    validations.push(email && email.includes('@'));
    validations.push(password && password.trim().length >= 6);

    if (stageNew) {
      validations.push(name && name.trim().length >= 0);
      validations.push(confirmPassword);
      validations.push(confirmPassword === password);
    }

    const validForm = validations.reduce((all, v) => all && v);
    setValidForm(validForm);
  }

  async function signin() {
    try {
      await api.post('/signup', {
        name,
        email,
        password,
      });

      Alert.alert('Sucesso!', 'Usuario cadastrado');
      setStageNew(false);
    } catch (error) {
      showError(error);
    }
  }

  async function signup() {
    try {
      const response = await api.post('/signin', {
        email,
        password,
      });

      api.defaults.headers.common[
        'Authorization'
      ] = `bearer ${response.data.token}`;

      AsyncStorage.setItem('userData', JSON.stringify(response.data));

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: response.data }],
      });
    } catch (error) {
      Alert.alert('Erro', error);
    }
  }

  function signinOrSignup() {
    if (stageNew) {
      signin();
    } else {
      signup();
    }
  }

  return (
    <LinearGradient colors={['#080809', '#505362']} style={styles.background}>
      <Text style={styles.title}>todo</Text>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {stageNew ? 'Criar a sua conta' : 'Informe seus dados'}
          </Text>
          {stageNew && (
            <AuthInput
              icon="user"
              placeholder="Nome"
              style={styles.input}
              value={name}
              onChangeText={(value) => setName(value)}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="E-mail"
            style={styles.input}
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <AuthInput
            icon="lock"
            secureTextEntry={true}
            placeholder="Senha"
            style={styles.input}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          {stageNew && (
            <AuthInput
              icon="asterisk"
              placeholder="Confirmação"
              secureTextEntry={true}
              style={styles.input}
              value={confirmPassword}
              onChangeText={(value) => setConfirmPassword(value)}
            />
          )}
          <TouchableOpacity disabled={!validForm} onPress={signinOrSignup}>
            <View
              style={[styles.button, !validForm ? styles.disableButton : {}]}
            >
              <Text style={styles.buttonText}>
                {stageNew ? 'Registrar' : 'Entrar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.paddingButton}
          onPress={() => setStageNew(!stageNew)}
        >
          <Text style={styles.buttonText}>
            {stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 60,
    marginTop: 20,
    marginLeft: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    width: '90%',
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
  },
  disableButton: {
    backgroundColor: '#AAA',
  },
  paddingButton: {
    padding: 10,
  },
});
