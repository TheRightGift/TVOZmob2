import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Loading from './component/Loading';
import SignIn from './component/gateway/SignIn';
import ForgotPassword from './component/gateway/ForgotPassword';
import SignUp from './component/gateway/SignUp';
import LiveScreen from './component/LiveVOD/LiveScreen';
import VodScreen from './component/LiveVOD/VodScreen';
import VODdetailScreen from './component/LiveVOD/VODdetailScreen';
import TvDetailsScreen from './component/LiveVOD/TvDetailsScreen';
import TvPlayer from './component/LiveVOD/TvPlayer';
import VODPlayer from './component/LiveVOD/VODPlayer';
import Settings from './component/Settings';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from "./state/store";
import { NotifierWrapper  } from 'react-native-notifier';
import codePush from 'react-native-code-push';

const liveVOD = createMaterialBottomTabNavigator(
	{
		LiveScreen: { 
			screen: LiveScreen,
			navigationOptions: {
				title: "LIVE",
				tabBarIcon: ({ tintColor }) => <Icon name='tv' size={20} color={tintColor} />
			}
		},
		VodScreen: { 
			screen: VodScreen,
			navigationOptions: {
				title: "VOD",
				tabBarIcon: ({ tintColor }) => <Icon name='film' size={20} color={tintColor} />
			} 
		},
		Settings: { 
			screen: Settings,
			navigationOptions: {
				title: "ACCOUNT",
				tabBarIcon: ({ tintColor }) => <Icon name='user-circle' size={20} color={tintColor} />
			} 
		}
	},
	{
	  initialRouteName: "LiveScreen",
	  activeColor: "white",
	  barStyle: { backgroundColor: "#900C3F" },
	  labeled: true
	}
);

const AppStack = createStackNavigator({ 
	liveVOD: { screen: liveVOD},
	VODdetailScreen: { screen: VODdetailScreen},
	VODPlayer: { screen: VODPlayer},
	TvDetailsScreen: { screen: TvDetailsScreen},
	TvPlayer: { screen: TvPlayer},
},
{
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	}
});

const AuthStack = createStackNavigator({ 
	SignIn: { screen: SignIn },
	SignUp: { screen: SignUp },
	ForgotPassword: { screen: ForgotPassword }
},
{
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	}
});

const navStack = createSwitchNavigator(
	{
	  Loading,
	  AppStack,
	  AuthStack
	},
	{
	  initialRouteName: 'Loading',
	}
);

let Nav = createAppContainer(navStack);



class App extends React.Component {
	
	render() {
		return (
			<NotifierWrapper>
				<Provider store={store}><Nav/></Provider>		
			</NotifierWrapper>		
		);
	}
}
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };
export default codePush(codePushOptions)(App); 
