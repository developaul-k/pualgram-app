import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import SelectPhoto from '../screens/Photo/SelectPhoto';
import TakePhoto from '../screens/Photo/TakePhoto';
import UploadPhoto from '../screens/Photo/UploadPhoto';
import { stackStyles } from './config';
import styles from '../styles';

const stackFactory = (initialRoute, customOptions) =>
  createStackNavigator(
    {
      initialRoute: {
        screen: initialRoute
      },
      Upload: {
        screen: UploadPhoto,
        navigationOptions: {
          title: '새 게시물'
        }
      }
    },
    {
      defaultNavigationOptions: {
        ...customOptions,
        headerStyle: {
          ...stackStyles
        },
        headerTintColor: styles.blackColor
      },
      headerLayoutPreset: 'center'
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

export default PhotoTabs;

/* export default createStackNavigator(
  {
    Tabs: {
      screen: PhotoTabs
    },
    Upload: {
      screen: UploadPhoto,
      navigationOptions: {
        title: 'Upload'
      }
    }
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerTintColor: styles.blackColor,
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center'
      }
    }
  }
);
 */
