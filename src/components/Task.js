import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import commonStyles from '../commonStyles';

export default function Task({
  id,
  doneAt,
  desc,
  estimateAt,
  onToggleTask,
  onDelete,
}) {
  let check = null;
  if (doneAt) {
    check = (
      <View style={styles.done}>
        <Icon name="check" size={20} color={commonStyles.colors.secondary} />
      </View>
    );
  } else {
    check = <View style={styles.pending} />;
  }

  const descStyle = doneAt ? { textDecorationLine: 'line-through' } : {};

  function getLeftContent() {
    return (
      <View style={[styles.exclude, styles.leftContent]}>
        <Icon name="trash" size={20} color="#FFF" />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    );
  }

  function getRightContent() {
    return (
      <TouchableOpacity
        style={[styles.exclude, styles.rightContent]}
        onPress={() => onDelete(id)}
      >
        <View>
          <Icon name="trash" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Swipeable
      renderRightActions={getRightContent}
      renderLeftActions={getLeftContent}
      onSwipeableLeftOpen={() => onDelete(id)}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => onToggleTask(id)}
          style={styles.checkContainer}
        >
          {check}
        </TouchableWithoutFeedback>
        <View style={styles.taskInfo}>
          <Text style={[styles.description, descStyle]}>{desc}</Text>
          <Text style={styles.date}>
            {moment(estimateAt).locale('pt-br').format('ddd, D [de] MMMM')}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  done: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    borderWidth: 1,
    height: 25,
    width: 25,
    borderRadius: 15,
    borderColor: '#555',
  },
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#AAA',
    paddingLeft: 10,
    alignItems: 'center',
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  description: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 20,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 15,
  },
  exclude: {
    backgroundColor: '#7C0909',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  excludeText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  },
  rightContent: {
    padding: 20,
  },
  taskInfo: {
    paddingLeft: 20,
  },
  leftContent: {
    flex: 1,
  },
});
