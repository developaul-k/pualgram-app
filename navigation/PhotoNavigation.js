import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import TakePhoto from '../screens/Photo/TakePhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';
import { stackStyles } from './config';
import styles from '../styles';

const PhotoTabs = createBottomTabNavigator(
  {
    Take: {
      screen: TakePhoto,
      navigationOptions: {
        tabBarLabel: '카메라'
      }
    },
    Select: {
      screen: SelectPhoto,
      navigationOptions: {
        tabBarLabel: '라이브러리'
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
        title: 'Choose Photo',
        headerBackTitle: null
      }
    },
    Upload: {
      screen: UploadPhoto,
      navigationOptions: {
        title: 'Upload'
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerTintColor: styles.blackColor
    }
  }
);
