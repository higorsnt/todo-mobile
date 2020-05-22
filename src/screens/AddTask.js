import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import commonStyles from '../commonStyles';

export default function AddTask({ onSave, isVisible, onCancel, daysAhead }) {
  const initialState = () => {
    return {
      date: new Date(),
      desc: '',
      showDatePicker: false,
    };
  };

  const [desc, setDesc] = useState(initialState().desc);
  const [date, setDate] = useState(initialState().date);
  const [showDatePicker, setShowDatePicker] = useState(
    initialState().showDatePicker,
  );

  function resetStates() {
    setDate(initialState().date);
    setDesc(initialState().desc);
    setShowDatePicker(initialState().showDatePicker);
  }

  function save() {
    if (!desc.trim()) {
      Alert.alert(
        'Dados inválidos.',
        'Informe uma descrição para adicionar uma tarefa.',
      );
      return;
    }

    const data = { desc, date };
    onSave(data);
    resetStates();
  }

  function getDatePicker() {
    let datePicker = (
      <DateTimePicker
        mode="date"
        value={date}
        onChange={(_, date) => {
          date = date ? date : new Date();
          setShowDatePicker(false);
          setDate(date);
        }}
      />
    );

    const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY');

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.date}>{dateString}</Text>
          </TouchableOpacity>
          {showDatePicker && datePicker}
        </View>
      );
    }

    return datePicker;
  }

  let styleColor = null;
  switch (daysAhead) {
    case 0:
      styleColor = commonStyles.colors.today;
      break;
    case 1:
      styleColor = commonStyles.colors.tomorrow;
      break;
    case 7:
      styleColor = commonStyles.colors.week;
      break;
    case 30:
      styleColor = commonStyles.colors.month;
      break;
    default:
      styleColor = commonStyles.colors.month;
      break;
  }

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
      animationType="slide"
      onShow={resetStates}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={[styles.header, { backgroundColor: styleColor }]}>
          Nova Tarefa
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a Descrição..."
          onChangeText={(value) => setDesc(value)}
          value={desc}
        />
        {getDatePicker()}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.button, { color: styleColor }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save}>
            <Text style={[styles.button, { color: styleColor }]}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: 50,
    margin: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
    paddingLeft: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15,
  },
});
