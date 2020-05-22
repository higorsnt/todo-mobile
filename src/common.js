import { Alert } from 'react-native';

export default function showError(err) {
  if (err.response && err.response.data) {
    Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`);
  } else {
    Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`);
  }
}
