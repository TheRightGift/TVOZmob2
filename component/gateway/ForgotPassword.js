import React, {Component} from "react";
import { View, StyleSheet, Text, Image, Dimensions, StatusBar, ActivityIndicator, ImageBackground } from "react-native";

import { Body, Content, Container, Header, Left, Right, Title} from "native-base";
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import { Card, Button, Input, Overlay  } from "react-native-elements";
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import Core from "../../Core";
import Database from '../../database';
const db = new Database();

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#900C3F',
	},
	container: {
	  flex: 1,
	  flexDirection: "column",
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	transBackgrnd: {
		backgroundColor: 'rgba(52, 52, 52, 0.1)'
	},
	instructions: {
	  textAlign: 'center',
	  color: '#333333',
	  height: height / 4,
	},
	imgBack: {   
		width: width - 200,
		height: height / 4,
		alignItems: 'center',
		marginTop: height / 4,
		resizeMode: 'contain'
	},
	title: {
		fontSize: 30,
	  	textAlign: 'center',
		  margin: 40,
		  color: '#ffffff'
	},
	subTitle: {
		fontSize: 20,
		textAlign: 'center',
		margin: 20,
		color: '#767576'
	},
	regSect: {
		marginTop: 40,
	},
	regTxt: {
		textAlign: 'center',
		color: '#D5D3D6',
	},
	loader: {
        height: height / 5,
        justifyContent: 'center',
		alignItems: 'center',
		width: '30%'
    },
});

class ForgotPassword extends Component {
	static navigationOptions =  {
		title: 'Sign In',
	};

	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			phone: '',
			isVisible: false,
			uniqueId: DeviceInfo.getUniqueId()
		};
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#900C3F');
	} /* End constructor. */

	onChangeText  = (key, val) => {
		console.log(key, val)
		this.setState({ [key]: val })
	}

	onSubmit = (e) => {
		this.setState({ isVisible: true });
		var err = 0;
		if(this.state.phone == '') {
			this.recoverErr();
		} else {			
			
			const uniqueId = this.state.uniqueId;
			
			const recoverFormData = {
				phone: this.state.phone.trim(),
				mac: uniqueId
			}	
			
			Core.io.emit("userAccountRecovery", { recoverFormData });//use socket to send regFormData to server
		}		
	}

	recoverErr(){
		this.setState({ isVisible: false });
		Notifier.showNotification({
			title: 'Recover Password',
			description: 'Invalid Phone Number!',
			duration: 3500,
			showAnimationDuration: 800,
			showEasing: Easing.bounce,
			// onHidden: () => console.log('Hidden'),
			// onPress: () => console.log('Press'),
			hideOnPress: true,
			swipePixelsToClose: 20,
			Component: NotifierComponents.Alert,
			componentProps: {
				alertType: 'error',
			},
		});
	}

	render() {
		const { navigate } = this.props.navigation;
		
		if(this.props.serverConn){
			
			return (
				<ImageBackground source={require('../../img/tvozBkgrd.jpg')} style={{flex: 1}}>
					<Container style={styles.transBackgrnd}>					
						<Text style={styles.title}>TVOZ</Text>
						<Content padder>
							
							<Card>
								<Text style={styles.subTitle}>Recover Account</Text>
								<Text>Enter the phone number attached to this account.</Text>
								<Input keyboardType="numeric" containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder='080xxxxxxxx' name="phone" onChangeText={val => this.onChangeText('phone', val)}/>
								
								<Button buttonStyle={{ marginTop: 20, backgroundColor: '#900C3F'}} title="Recover" onPress={() => { this.onSubmit();}}/>
								
								
								<View style={styles.regSect}>
									<Text style={styles.regTxt}>Don't have an account?</Text>
									<Button  type="clear" title="Sign Up" onPress={() => navigate("SignUp")}/>
								</View>
							</Card>
						</Content>
						<Overlay isVisible={this.state.isVisible} overlayStyle={styles.loader}>
							<ActivityIndicator size="large"/>
						</Overlay>
					</Container>
				</ImageBackground>
			)
		} else {
			return (
				<Container>						
					<Header hasSegment style={styles.header}>
						<Left/>
						<Body>
							<Title>
								TVOZ
							</Title>
						</Body>
						<Right/>
					</Header>
					<Content padder>
						<View style={styles.container}>
							<Image source = {require('../../img/noNetwork.png')} style={styles.imgBack}/>
							<Text style={styles.instructions}>No TVOZ network connection!</Text>
						</View>
					</Content>
				</Container>
				
			);
		}

	}
}

/**
 * Function to map state to Component props.
 */
const mapStateToProps = (inState) => {
	return {
	  serverConn : inState.serverState.connection
	};
};
  
  
  // Export components.
  export default connect(mapStateToProps)(ForgotPassword);

