import React from 'react'
import {StyleSheet, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AnimatedLoader from "react-native-animated-loader";
import { signedInStatus, getUserSub, getUserData, getUserPaymentData } from "../state/actions";
import store from "../state/store";
import Core from "../Core";
import DeviceInfo from 'react-native-device-info';
import Database from '../database';
const db = new Database();

export default class Loading extends React.Component {
	constructor(inProps) {
        super(inProps);
        
        const st = store.getState();
		this.state = {
            sessionId: st.serverState.serverSessionId,
            signedIn: st.navigationState.signedIn,   
            commStatus: st.serverState.comStatus,
            loader: true,
            uniqueId: DeviceInfo.getUniqueId(),
            appVersion: DeviceInfo.getVersion()
        };	
        Core.startup();  
        
    } /* End constructor. */
    
	componentDidMount() {
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('#900C3F');
        setTimeout(() => {
            db.checkLogin().then((data) => {
                let len = data.length;
                if (len < 1) {		
                    this.loggedOut();
                } else {
                    store.dispatch(getUserData(data));
                    this.loggedIn();			
                    		
                }
            }).catch((err) => {
                //console.log(err);
            });
        }, 5000)
        
    	// do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }

    loggedOut = () => {
        this.setState({ signedIn: false });
        store.dispatch(signedInStatus(false));
        this.setState({ loader: false });
        this.props.navigation.navigate('SignIn');        
    }

    loggedIn = () => {
        this.setState({ signedIn: true });
        store.dispatch(signedInStatus(true));	
        const uniqueId = this.state.uniqueId;
        const appVersion = this.state.appVersion;
        const authData = {
            mac: uniqueId,
            version: appVersion
        }		   
        
        //stop loader and show content
        this.setState({ loader: false });
        this.props.navigation.navigate('liveVOD');
               
        // db.lastPaymentHistory().then((res) => {												
        //     if(res.length > 0){ 
        //         Core.io.emit("getTagsVODsTvs", { authData });
        //         // Core.io.emit("getVOD", { authData });
        //         // Core.io.emit("getOngoingTv", { authData });
        //         // Core.io.emit("getTags", { authData });

        //         let expireDate = new Date(res[0]['dateExpire']);
        //         let today = new Date();
                
        //         if(expireDate > today){
        //             store.dispatch(getUserSub(true));
        //         } else {
        //             store.dispatch(getUserSub(false));
        //         }
                
        //         store.dispatch(getUserPaymentData(res[0]));
        //     }				
        //     //stop loader and show content
        //     this.setState({ loader: false });
        //     this.props.navigation.navigate('liveVOD');
        // }).catch((err) => {
        //     //console.log(err);
        // });		

    }

	render() {
        const { loader } = this.state;
		return(
            <AnimatedLoader
                visible={loader}
                overlayColor="#900C3F"
                animationStyle={styles.lottie}
                speed={1}
                source={require("../data.json")}
            />
        );
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottie: {
        width: 100,
        height: 100
    }
})
