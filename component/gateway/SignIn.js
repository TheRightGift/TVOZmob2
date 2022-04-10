import React, {Component} from "react";
import { View, StyleSheet, Text, Image, Dimensions, StatusBar, ImageBackground, ActivityIndicator } from "react-native";

import { Body, Content, Container, Header, Left, Right, Title} from "native-base";
import { Card, Button, Input, Overlay  } from "react-native-elements";
import { getUserPaymentData, getUserData, signedInStatus, getUserSub } from "../../state/actions";
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import PasswordInputText from 'react-native-hide-show-password-input';
import Network from '../Network';
import Core from "../../Core";
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import store from "../../state/store";
import Database from '../../database';
import Orientation from "react-native-orientation";
const db = new Database();

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	imgBackground: {
        flex: 1
    },
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

class SignIn extends Component {
	static navigationOptions =  {
		title: 'Sign In',
	};

	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			uName: '',
			pass: '',
			formError: '',
			isVisible: false,
			uniqueId: DeviceInfo.getUniqueId()
		};
		
	} /* End constructor. */

	onChangeText  = (key, val) => {
		this.setState({ [key]: val })
	}

	onSubmit = (e) => {
		
		this.setState({ isVisible: true });
		var err = 0;
		if(this.state.uName == '' || this.state.pass == '') {
			this.loginErr();
		} else {			
			
			const uniqueId = this.state.uniqueId;
			
			const loginFormData = {
				uName: this.state.uName.trim(),
				pass: this.state.pass.trim(),
				mac: uniqueId
			}	
			
			Core.io.emit("userLogin", { loginFormData });//use socket to send regFormData to server
		}		
	}

	login(){
		db.checkLogin().then((data) => {
			let len = data.length;
			if (len < 1) {		
				this.loggedOut();
			} else {
				const uniqueId = this.state.uniqueId;
				const authData = {
					mac: uniqueId
				}
				Core.io.emit("getVOD", { authData });
				Core.io.emit("getOngoingTv", { authData });
				Core.io.emit("getTags", { authData });
				
				store.dispatch(getUserData(data));
				this.setState({ isVisible: false });
				this.props.navigation.navigate('liveVOD');					
			}
		})		
	}

	loggedOut = () => {
        store.dispatch(signedInStatus(false));
        this.props.navigation.navigate('SignIn');        
    }

	loginErr(){
		this.setState({ isVisible: false });
		Notifier.showNotification({
			title: 'Login',
			description: 'Invalid Username/Password!',
			duration: 3500,
			showAnimationDuration: 800,
			showEasing: Easing.bounce,
			onHidden: () => console.log('Hidden'),
			onPress: () => console.log('Press'),
			hideOnPress: true,
			swipePixelsToClose: 20,
			Component: NotifierComponents.Alert,
			componentProps: {
				alertType: 'error',
			},
		});
	}
	
	componentDidMount() {
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#900C3F');
		
		Orientation.lockToPortrait();
		
		Core.io.on("loginSuccess", (data) => {
			if(data){				
				let id = data['mUser']['id'];
				let fName = data['mUser']['firstname'];
				let sName = data['mUser']['lastname'];
				let oName = data['mUser']['othername'];
				let phone = data['mUser']['phone'];
				let add = data['mUser']['add'];
				let pass = data['mUser']['password'];
				let uName = data['mUser']['username'];
				let mac = data['mUser']['macAddress'];	
				let date = data['mUser']['date'];
				let userData = {
					id: id,
					fName: fName,
					lName: sName,
					oName: oName,
					uName: uName,
					pass: pass,
					date: date,	
					phone: phone,
					add: add,
					mac: mac,			
				}
				
				//store value in sqliteDB
				db.addUser(userData).then((result) => {
					
					if(result.rowsAffected == 1){
						let payHistoryLen, a = 0;
						if(data['mUser']['payHistory'] == undefined){//covers 4 user who is logging in without payment history
							payHistoryLen = 0;
						} else {
							payHistoryLen = data['mUser']['payHistory'].length;
						}

						if(payHistoryLen > 0){
							for(a = 0; a < payHistoryLen; a++){
								//let subData = data['mUser']['payHistory'][a];
								let subData = {
									id: data['mUser']['payHistory'][a]['_id'],
									digit: data['mUser']['payHistory'][a]['digit'],
									dateUsed: data['mUser']['payHistory'][a]['dateUsed'],
									dateExpire: data['mUser']['payHistory'][a]['dateExpire'],
									numOfDays: data['mUser']['payHistory'][a]['numOfDays']			
								}
	
								if(a == (payHistoryLen - 1)){
									db.addPayment(subData).then((result) => {						
										if(result.rowsAffected == 1){
											db.lastPaymentHistory().then((res) => {	
												
												if(res.length > 0){
													let expireDate = new Date(res[0]['dateExpire']);
													let today = new Date();

													if(expireDate > today){
														store.dispatch(getUserSub(true));
													} else {
														store.dispatch(getUserSub(false));
													}
													store.dispatch(getUserPaymentData(res[0]));				
												}			
	
												this.login();
											}).catch((err) => {
												//console.log(err);
											});							
										}						
									}).catch((err) => {
										//console.log(err);
									})
								} else {
									db.addPayment(subData).then((result) => {	
														
									}).catch((err) => {
										//console.log(err);
									})
								}
							}
						} else {
							this.login();
						}						

					} else {
						//this.loginErr();						
					}
					
				}).catch((err) => {
					console.log(err);
				})
			} else {
				console.log('loading data');
			}
		});
		Core.io.on('loginErrorr', () => {
			this.loginErr();
		});
  	}; /* End componentDidMount(). */

	render() {
		const { navigate } = this.props.navigation;
		
		
		if(this.props.serverConn){			
			return (
				<ImageBackground source={require('../../img/tvozBkgrd.jpg')} style={{flex: 1}}>
					<Container style={styles.transBackgrnd}>						
						<Text style={styles.title}>TVOZ</Text>
						<Content padder>
							
							<Card>
								<Text style={styles.subTitle}>Login</Text>
								<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder='Username...' name="uName" onChangeText={val => this.onChangeText('uName', val)}/>
								<PasswordInputText containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Password..." name="pass" onChangeText={val => this.onChangeText('pass', val)} />
								<Button buttonStyle={{ marginTop: 20, backgroundColor: '#900C3F'}} title="Sign In" onPress={() => { this.onSubmit();}}/>
								
								
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
					<Header hasSegment style={styles.header}  iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
						<Left/>
						<Body>
							<Title>
								TVOZ
							</Title>
						</Body>
						<Right/>
					</Header>
					<Content padder>
						<Network/>
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
  export default connect(mapStateToProps)(SignIn);

