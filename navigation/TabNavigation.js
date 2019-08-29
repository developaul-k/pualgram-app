import React from 'react';
import { View, Image, Platform } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import Home from '../screens/Tabs/Home';
import Search from '../screens/Tabs/Search/SearchContainer';
import Notifications from '../screens/Tabs/Notifications';
import Profile from '../screens/Tabs/Profile';
import Detail from '../screens/Detail';
import MessagesLink from '../components/MessagesLink';
import NavIcon from '../components/NavIcon';
import SearchBar from '../components/SearchBar';
import styles from '../styles';
import { stackStyles } from './config';

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: { ...customConfig }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          headerTintColor: styles.blackColor,
          title: 'Photo'
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerStyle: { ...stackStyles }
      }
    }
  );

const TabNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {
        headerRight: <MessagesLink />,
        headerTitle: (
          <Image
            style={{ height: 45 }}
            resizeMode='contain'
            source={require('../assets/logo.png')}
          />
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
            color={styles.pantsColor}
          />
        )
      }
    },
    Search: {
      screen: stackFactory(Search, {
        headerBackTitle: null
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
            color={styles.pantsColor}
          />
        )
      }
    },
    Add: {
      screen: View,
      navigationOptions: {
        tabBarOnPress: ({ navigation }) =>
          navigation.navigate('PhotoNavigation'),
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
            color={styles.dressColor}
            size={33}
          />
        )
      }
    },
    Notifications: {
      screen: stackFactory(Notifications, {
        title: 'Notifications'
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={
              Platform.OS === 'ios'
                ? focused
                  ? 'ios-heart'
                  : 'ios-heart-empty'
                : focused
                ? 'md-heart'
                : 'md-heart-empty'
            }
            color={styles.pantsColor}
          />
        )
      }
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: 'Profile'
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            color={styles.pantsColor}
          />
        )
      }
    }
  },
  {
    initialRouteName: 'Profile',
    tabBarOptions: {
      showLabel: false,
      style: {
        ...stackStyles
      }
    }
  }
);

export default TabNavigation;
