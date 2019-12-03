import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import styled from 'styled-components';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import TakePhoto from '../screens/Photo/TakePhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';
import { stackStyles, stackTitleStyles } from './config';
import styles from '../styles';

const HeaderTitle = styled.Text`
  font-size: 15px;
  font-weight: 500;
`;

const stackFactory = (initailRoute, configure) =>
  createStackNavigator(
    {
      initailRoute: {
        screen: initailRoute,
        navigationOptions: { ...configure }
      }
    },
    {
      headerLayoutPreset: 'center',
      defaultNavigationOptions: {
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>
      }
    }
  );

const PhotoTabs = createBottomTabNavigator(
  {
    Take: {
      screen: stackFactory(TakePhoto, { title: '카메라' }),
      navigationOptions: {
        title: '카메라'
      }
    },
    Select: {
      screen: stackFactory(SelectPhoto, { title: '라이브러리' }),
      navigationOptions: {
        title: '라이브러리'
      }
    }
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      indicatorStyle: {
        marginBottom: 20,
        backgroundColor: styles.blackColor
      },
      labelStyle: {
        fontWeight: '600'
      },
      style: {
        ...stackStyles,
        justifyContent: 'center',
        alignItems: 'center'
      },
      showIcon: false,
      activeTintColor: '#000',
      inactiveTintColor: '#bbb'
    }
  }
);

export default createStackNavigator(
  {
    Tabs: {
      screen: PhotoTabs,
      navigationOptions: {
        title: '카메라',
        header: null
      }
    },
    Upload: {
      screen: UploadPhoto,
      navigationOptions: {
        title: '새 게시물'
      }
    }
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerTintColor: styles.blackColor,
      headerTitleStyle: {
        ...stackTitleStyles
      },
      headerBackTitle: null
    }
  }
);
