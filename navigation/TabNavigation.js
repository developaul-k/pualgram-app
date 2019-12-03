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
import UserDetail from '../screens/UserDetail';
import MessagesLink from '../components/MessagesLink';
import NavIcon from '../components/NavIcon';
import SearchBar from '../components/SearchBar';
import styles from '../styles';
import { stackStyles } from './config';
import Comment from '../screens/Comment';
import constants from '../constants';

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: { ...customConfig, headerLayoutPreset: 'center' }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          title: 'Photo'
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam('username')
        })
      },
      Comment: {
        screen: Comment,
        navigationOptions: {
          title: '댓글'
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        headerStyle: { ...stackStyles }
      },
      headerLayoutPreset: 'center'
    }
  );

const TabNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {
        headerRight: <MessagesLink />,
        headerTitle: (
          <View
            style={{
              width: constants.width,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              style={{ height: 45 }}
              resizeMode="contain"
              source={require('../assets/logo.png')}
            />
          </View>
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
            color={styles.pantsColor}
          />
      }
    },
    Search: {
      screen: stackFactory(Search, {
        headerBackTitle: null
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
            color={styles.pantsColor}
          />
      }
    },
    Add: {
      screen: View,
      navigationOptions: {
        tabBarOnPress: ({ navigation }) =>
          navigation.navigate('PhotoNavigation'),
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
            color={styles.dressColor}
            size={33}
          />
      }
    },
    Notifications: {
      screen: stackFactory(Notifications, {
        title: 'Notifications'
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={
              Platform.OS === 'ios'
                ? focused ? 'ios-heart' : 'ios-heart-empty'
                : focused ? 'md-heart' : 'md-heart-empty'
            }
            color={styles.pantsColor}
          />
      }
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: 'Profile'
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) =>
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            color={styles.pantsColor}
          />
      }
    }
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      showLabel: false,
      style: {
        ...stackStyles
      }
    }
  }
);

export default TabNavigation;
