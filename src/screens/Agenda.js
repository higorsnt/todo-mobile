/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';

import showError from '../common';
import commonStyles from '../commonStyles';
import api from '../service/api';

import Task from '../components/Task';
import AddTask from './AddTask';

export default function Agenda() {
  const [tasks, setTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  const routes = useRoute();
  const { title, daysAhead } = routes.params;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('focus', async (e) => {
      await loadTasks();
    });
  }, []);

  useEffect(filterTasks, [tasks, showDoneTasks]);

  async function toggleTask(id) {
    try {
      await api.put(`/tasks/${id}/toggle`);
      await loadTasks();
    } catch (error) {
      showError(error);
    }
  }

  async function addTask(task) {
    try {
      await api.post('/tasks', {
        desc: task.desc,
        estimateAt: task.date,
      });

      setShowAddTask(false);
      await loadTasks();
    } catch (error) {
      showError(error);
    }
  }

  async function loadTasks() {
    try {
      const maxDate = moment()
        .add({ days: daysAhead })
        .format('YYYY-MM-DD 23:59');
      const res = await api.get(`/tasks?date=${maxDate}`);
      setTasks(res.data);
    } catch (error) {
      showError(error);
    }
  }

  function filterTasks() {
    let visible = null;

    if (showDoneTasks) {
      visible = [...tasks];
    } else {
      const pending = (task) => task.doneAt === null;

      visible = tasks.filter(pending);
    }

    setVisibleTasks(visible);
  }

  function toggleFilter() {
    setShowDoneTasks(!showDoneTasks);
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      showError(error);
    }
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
    <View style={styles.container}>
      <AddTask
        isVisible={showAddTask}
        onCancel={() => setShowAddTask(false)}
        onSave={addTask}
        daysAhead={daysAhead}
      />
      <View style={[styles.background, { backgroundColor: styleColor }]}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="bars" size={30} color={commonStyles.colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFilter}>
            <Icon
              name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
          </Text>
        </View>
      </View>
      <View style={styles.tasksContainer}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Task
              {...item}
              onDelete={() => deleteTask(item.id)}
              onToggleTask={() => toggleTask(item.id)}
            />
          )}
        />
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: styleColor }]}
        activeOpacity={0.7}
        onPress={() => setShowAddTask(true)}
      >
        <Icon name="plus" size={30} color={commonStyles.colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  background: {
    flex: 3,
    borderBottomEndRadius: 45,
    borderBottomLeftRadius: 45,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  tasksContainer: {
    flex: 7,
  },
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
