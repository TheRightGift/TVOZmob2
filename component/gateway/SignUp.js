import React, {Component} from "react";
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, ActivityIndicator, ImageBackground, StatusBar, TextInput  } from "react-native";

import { Body, Content, Container, Header, Left, Right, Title} from "native-base";
import { Card, Button, Input, Overlay } from "react-native-elements";
import { connect } from "react-redux";
import { getUserData, signedInStatus } from "../../state/actions";
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import Network from '../Network';
import store from "../../state/store";
import Core from "../../Core";
import PasswordInputText from 'react-native-hide-show-password-input';
import DeviceInfo from 'react-native-device-info';

import Database from '../../database';

const db = new Database();

let { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	row: {
		flex: 1,
    	flexDirection: 'row',
		justifyContent: 'space-between',
		
	},
	button: {
		width: '48%',
		marginTop: 20,
	},
	loader: {
        height: height / 5,
        justifyContent: 'center',
		alignItems: 'center',
		width: '30%'
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
	loginSect: {
		marginTop: 40,
	},
	loginTxt: {
		textAlign: 'center',
		color: '#D5D3D6',
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		height: height / 4,
	},
	imgBack: {   
		width: width - 200,
		height: height / 4,
		marginTop: height / 4,
		alignItems: 'center',
		resizeMode: 'contain'
	},
	transBackgrnd: {
		backgroundColor: 'rgba(52, 52, 52, 0.1)'
	},
	pass: {
		width: '70%'
	},
	passInstruction: {
		fontSize: 10
	}
});

class SignUp extends Component {
	static navigationOptions =  {
		title: 'Sing Up',
	};

	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);

		this.state = {
			fName: '',
			lName: '',
			oName: '',
			uName: '',
			phone: '',
			add: '',
			pass: '',
			cPass:'',
			formError: '',
			isVisible: false,
			nameVisible: true,
			phoneAddVisible: false,
			userPassVisible: false,
			passInstruction1: false,
			passInstruction2: false,
			passInstruction3: false,
			passInstruction4: false,
			uniqueId: DeviceInfo.getUniqueId(),
			appVersion: DeviceInfo.getVersion()
		};
		
	} /* End constructor. */

	onChangeText  = (key, val) => {
		if(key === 'pass'){
			if(this.hasNumber(val)){
				this.setState({passInstruction2: true});
			} else {
				this.setState({passInstruction2: false});
			}
			
			if(this.hasUppercase(val)){
				this.setState({passInstruction3: true});
			} else {
				this.setState({passInstruction3: false});
			}
			
			if(this.hasUnderscore(val)){
				this.setState({passInstruction4: true});
			} else {
				this.setState({passInstruction4: false});
			}
			
			if(val.length >= 8){
				this.setState({passInstruction1: true});
			} else {
				this.setState({passInstruction1: false});
			}
		}
		
		this.setState({ [key]: val })
	}
	hasNumber(myString) {
		return /\d/.test(myString);
	}

	hasUppercase(myString) {
		return /[A-Z]/.test(myString);
	}
	hasUnderscore(myString) {
		return /_/.test(myString);
	}

	handlePass = (text) => {
		this.setState({ pass: text })
	}

   	onSubmit = (e) => {
		this.setState({ isVisible: true });
		var err = 0;

		if(this.state.fName == '' ||this.state.lName == '' || this.state.uName == '' ||this.state.phone == '' || this.state.add == '' || this.state.pass == '' || this.state.cPass == '') {
			err = 1;
		} else if( this.state.pass != this.state.cPass ) {
			err = 2;
		} else if(!this.hasNumber(this.state.pass) || !this.hasUppercase(this.state.pass) || !this.hasUnderscore(this.state.pass) || this.state.pass.length < 8){
			err = 3;
		}

		if(err == 1){
			this.submitErr('Registration Error', 'All fields except "othername" are required!');
		} else if(err == 2){
			this.submitErr('Registration Error', 'Passwords must match!');
		} else if(err == 3) {
			this.submitErr('Registration Error', 'Password must be atleast 8 characters, contain atleast a number, atleast an uppercase character and an underscore (_)');
		} else {
			
			
			const regFormData = {
				fName: this.state.fName.trim(),
				oName: this.state.oName.trim(),
				lName: this.state.lName.trim(),
				uName: this.state.uName.trim(),
				phone: this.state.phone.trim(),
				add: this.state.add.trim(),
				pass: this.state.pass.trim(),
				mac: this.state.uniqueId
			}			
			Core.io.emit("userRegister", { regFormData });//use socket to send regFormData to server
		}		
	}
	
	login(){
		db.checkLogin().then((data) => {
			let len = data.length;
			if (len < 1) {		
				this.loggedOut();
			} else {
				const uniqueId = this.state.uniqueId;
				const appVersion = this.state.appVersion;
				const authData = {
					mac: uniqueId,
					version: appVersion
				}
				//TODO: consider not requesting for VOD and TV as user is yet to pay
				Core.io.emit("getTagsVODsTvs", { authData });
				// Core.io.emit("getVOD", { authData });
				// Core.io.emit("getOngoingTv", { authData });
				// Core.io.emit("getTags", { authData });
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

	submitErr(title, msg){
		this.setState({ isVisible: false });
		Notifier.showNotification({
			title: title,
			description: msg,
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

	toPhoneAdd = () => {
		this.setState({ 
			nameVisible: false,
			phoneAddVisible: true,
			userPassVisible: false
		});
	}

	toName = () => {
		this.setState({ 
			nameVisible: true,
			phoneAddVisible: false,
			userPassVisible: false
		});
	}

	toUserPass = () => {
		this.setState({ 
			nameVisible: false,
			phoneAddVisible: false,
			userPassVisible: true
		});
	}

	componentDidMount() {
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#900C3F');
		
		Core.io.on("userRegistered", (data) => {
			let id = 1;
			let fName = data.newData.fName;
			let sName = data.newData.lName;
			let oName = data.newData.oName;
			let phone = data.newData.phone;
			let add = data.newData.add;
			let pass = data.newData.pass;
			let uName = data.newData.uName;
			let mac = data.newData.mac;		
			let date = new Date(); 
			
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
					this.login();
				}
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	render() {
		let viewFormSection;
		const { navigate } = this.props.navigation;
		const { pass } = this.state;

		if(this.state.nameVisible == true && this.state.phoneAddVisible == false && this.state.userPassVisible == false){
			viewFormSection = 	<View>
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Firstname" name="fName" value={this.state.fName} onChangeText={val => this.onChangeText('fName', val)} />
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Othername" name="oName" value={this.state.oName} onChangeText={val => this.onChangeText('oName', val)} />
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Lastname" name="lName" value={this.state.lName} onChangeText={val => this.onChangeText('lName', val)} />
									<Button buttonStyle={{ marginTop: 10, backgroundColor: '#900C3F'}} title="Next" onPress={() => { this.toPhoneAdd();}}/>
								</View>
		} else if(this.state.nameVisible == false && this.state.phoneAddVisible == true && this.state.userPassVisible == false) {
			viewFormSection = 	<View>
									
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} keyboardType='numeric' value={this.state.phone} placeholder="Phone Number" name="phone" onChangeText={val => this.onChangeText('phone', val)} />
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Address" value={this.state.add} name="add" onChangeText={val => this.onChangeText('add', val)} />
									<Input containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Username" name="uName" value={this.state.uName} onChangeText={val => this.onChangeText('uName', val)} />
									<View style={styles.row}>
										<View style={styles.button}>
											<Button buttonStyle={{ backgroundColor: '#900C3F'}} title="Back" onPress={() => { this.toName();}}/>
										</View>
										<View style={styles.button}>
											<Button buttonStyle={{ backgroundColor: '#900C3F'}} title="Next" onPress={() => { this.toUserPass();}}/>
										</View>
										
									</View>									
								</View>
		} else if(this.state.nameVisible == false && this.state.phoneAddVisible == false && this.state.userPassVisible == true) {
			viewFormSection = 	<View>
									
									<PasswordInputText containerStyle={{paddingLeft: 0, paddingRight: 0}} placeholder="Password" value={this.state.pass} name="pass" onChangeText={val => this.onChangeText('pass', val)} />
									<Text style={[styles.passInstruction, {color: this.state.passInstruction1 ? 'green' : 'red'}]}>Password must be atleast 8 characters.</Text>
									<Text style={[styles.passInstruction, {color: this.state.passInstruction2 ? 'green' : 'red'}]}>Password must contain atleast 1 number.</Text>
									<Text style={[styles.passInstruction, {color: this.state.passInstruction3 ? 'green' : 'red'}]}>Password must contain atleast 1 uppercase character.</Text>
									<Text style={[styles.passInstruction, {color: this.state.passInstruction4 ? 'green' : 'red'}]}>Password must contain an underscore.</Text>
									<PasswordInputText label="Confirm Password" containerStyle={{paddingLeft: 0, paddingRight: 0}} value={this.state.cPass} placeholder="Confirm Password" name="cPass" onChangeText={val => this.onChangeText('cPass', val)} />

									<View style={styles.row}>
										<View style={styles.button}>
											<Button buttonStyle={{ backgroundColor:"#900C3F"}} title="Back" onPress={() => { this.toPhoneAdd();}}/>
										</View>
										<View style={styles.button}>
											<Button buttonStyle={{ backgroundColor:"#900C3F"}} title="Sign Up"
												//onPress={() => { onSignIn().then(() => navigate("SignedIn"));}}
												onPress={() => { this.onSubmit();}}
											/>
										</View>
										
									</View>									
									
								</View>
		}
		if(this.props.serverConn){
			return (
				<ImageBackground source={require('../../img/tvozBkgrd.jpg')} style={{flex: 1}}>
					
					<Container style={styles.transBackgrnd}>						
						<Content padder>
							<ScrollView>
								<Text style={styles.title}>TVOZ</Text>
								
								<Card style={styles.card}>
									<Text style={styles.subTitle}>Create Account</Text>

									{viewFormSection}								
									
									<View style={styles.loginSect}>
										<Text style={styles.loginTxt}>Already have an account?</Text>
										<Button type="clear" title="Sign In" onPress={() => navigate("SignIn")}/>
										<Button type="clear" title="Forgot Password" onPress={() => navigate("ForgotPassword")}/>
									</View>
									
								</Card>
							</ScrollView>
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
	  serverConn : inState.serverState.connection,
	};
  };
  
  
  // Export components.
  export default connect(mapStateToProps)(SignUp);