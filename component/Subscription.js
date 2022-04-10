import React, {Component} from "react";
import DeviceInfo from 'react-native-device-info';
import { StyleSheet, Text, Modal, Dimensions, Alert, StatusBar, ImageBackground} from "react-native";

import { Container, Header, Content, Button, Icon, Left, Body, Right, Title, Item, Input, CardItem, Card} from 'native-base';
import { connect } from "react-redux";
import Core from "../Core";
import { setSubscriptionModalVisible, getUserPaymentData, getUserSub } from "../state/actions";
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import store from "../state/store";
import Database from '../database';

const db = new Database();

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(52, 52, 52, 0.1)'
	},
	subscribeBtn: {
		width: '100%',
		flex:1,
		flexDirection: 'column',
		alignItems:'center',
		justifyContent: 'center'
	},
	subscribeBtnTxt: {
		color: 'white',
	},
	card: {
		marginTop: height / 4,
		backgroundColor: '#84636F'
	},
	noNetContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: 'center',
		alignItems: 'center',
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
		resizeMode: 'contain'
	},
	largertxt: {
		textAlign: 'center',
		fontSize: 25,
		
	},
	card: {
		marginTop: height / 4,
		padding: '5%'
	},
	subscribeBtn: {
		width: '100%',
		flex:1,
		flexDirection: 'column',
		alignItems:'center',
		justifyContent: 'center',
		backgroundColor: '#900C3F',
		
	},
	subscribeBtnTxt: {
		color: 'white',		
	},
	noSubscriptionTxt: {
		textAlign: 'center',
		color: '#888888',
		fontSize: 16,
		marginBottom: height / 15,
	},
	header: {
		backgroundColor: '#900C3F',
	},
	transBackgrnd: {
		backgroundColor: 'rgba(52, 52, 52, 0.1)'
	},
	bigIconStyle: {
		fontSize:20,
		color: "#fff",
		marginRight: 5
	}
});


/**
 * Main class of this component.
 */

 class Subscription extends Component {
	/**
	 * Constructor.
	 */
	constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
			pin: '',
			deviceInfo: DeviceInfo.getUniqueId()
		}		
	} /* End constructor. */
	
	setModalVisible(visible) {
		store.dispatch(setSubscriptionModalVisible(visible));
	}

	onChangeText  = (key, val) => {
		this.setState({ [key]: val })
	}

	onSubmit = (e) => {
		var err = 0;
		let pinVal = this.state.pin.trim();
		if( pinVal == '' || pinVal.length != 12 || Number.isInteger(pinVal)) {
			err = 1;
		} 

		if(err == 1){
			this.setModalVisible(false)
			this.loginErr();
		}  else {
			
			const uniqueId = this.state.deviceInfo;
			
			const subscribePIN = {
				pin: pinVal,
				mac: uniqueId
			}			
			Core.io.emit("subscribe", { subscribePIN });//use socket to send subscribePIN to server
		
		}		
	}

	loginErr(){
		Notifier.showNotification({
			title: 'Subscription Status',
			description: 'Invalid PIN!',
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

	postSubscription(){
		//this.props.navigation.navigate('liveVOD');
	}

	componentDidMount() {
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#900C3F');
		Core.io.on("subscriptionSuccess", (data) => {
			if(data){
				id = data['_id'];
				digit = data['digit'];
				dateUsed = data['dateUsed'];
				dateExpire = data['dateExpire'];
				numOfDays = data['numOfDays'];
				
				let subData = {
					id: id,
					digit: digit,
					dateUsed: dateUsed,
					dateExpire: dateExpire,
					numOfDays: numOfDays			
				}

				//store value in sqliteDB
				db.addPayment(subData).then((result) => {
					
					if(result.rowsAffected == 1){
						db.lastPaymentHistory().then((res) => {		
							const uniqueId = this.state.deviceInfo;
							const authData = {
								mac: uniqueId
							}								
							Core.io.emit("getVOD", { authData });
							Core.io.emit("getOngoingTv", { authData });

							store.dispatch(getUserPaymentData(res[0]));							
							store.dispatch(getUserSub(true));
							//this.props.navigation.navigate('liveVOD');
						}).catch((err) => {
							//console.log(err);
						});
						//change state and inform user of success
						Notifier.showNotification({
							title: 'Subscription Status',
							description: 'Successfull subscription',
							duration: 3500,
							showAnimationDuration: 800,
							showEasing: Easing.bounce,
							onHidden: () => this.setModalVisible(false),
							onPress: () => this.setModalVisible(false),
							hideOnPress: true,
							swipePixelsToClose: 20,
							Component: NotifierComponents.Alert,
							componentProps: {
								alertType: 'success',
							},
						});
					} else {
						//console error						
					}
					
				}).catch((err) => {
					//console.log(err);
				})
			} else {
				//console.log('loading data');
			}
		});
		Core.io.on('subscriptionError', (msg) => {
			this.setModalVisible(false)
			Notifier.showNotification({
				title: 'Subscription Status',
				description: msg,
				duration: 3500,
				showAnimationDuration: 800,
				showEasing: Easing.bounce,
				onHidden: () => this.setModalVisible(false),
				onPress: () => this.setModalVisible(false),
				hideOnPress: true,
				swipePixelsToClose: 20,
				Component: NotifierComponents.Alert,
				componentProps: {
					alertType: 'error',
				},
			});
		});
  	}; /* End componentDidMount(). */
	
	/**
	 * Component render().
	 */
	render() {
        return(	
			<ImageBackground source={require('../img/tvozBkgrd.jpg')} style={{flex: 1}}>		
				<Content padder>
					<Card style={styles.card}>
						<Text style={styles.largertxt}>
							Subscription Required.
						</Text>
						<Text style={styles.noSubscriptionTxt}>Please click on the button below to renew subscription @ N1,000/month</Text>
						<Button onPress={() => { this.setModalVisible(!this.state.modalVisible); }} style={styles.subscribeBtn}>
							<Text style={styles.subscribeBtnTxt}>Renew Subscription</Text>
						</Button>
					</Card>
					<Modal  animationType="slide" transparent={false} visible={this.props.mVisible} onRequestClose={() => {this.postSubscription()}}>
						<ImageBackground source={require('../img/tvozBkgrd.jpg')} style={{flex: 1}}>
							<Container style={styles.transBackgrnd}>
								<Header style={styles.header}>
									<Left>
										<Button transparent onPress={() => { this.setModalVisible(false); }}>
											<Icon name="close" type="MaterialCommunityIcons" style={styles.bigIconStyle}/>
										</Button>	
									</Left>
									<Body>
										<Title>Subscription</Title>
									</Body>
									<Right/>
								</Header>
								<Content padder style={styles.container}>
									<Card style={styles.card}>
										<CardItem>
										
										</CardItem>
										<CardItem>
											<Item regular>
												<Icon active name='card' />
												<Input placeholder='Enter 12-digit PIN' keyboardType={'numeric'} name="pin" onChangeText={val => this.onChangeText('pin', val)}/>
											</Item>
										</CardItem>
										<CardItem>
											<Button style={styles.subscribeBtn} onPress={() => { this.onSubmit();}}>
												<Text style={styles.subscribeBtnTxt}>Subscribe</Text>
											</Button>
										</CardItem>
									</Card>							
								</Content>
							</Container>
						</ImageBackground>					
					</Modal>
				</Content>		
			</ImageBackground>				
        );		
	} /* End render(). */
} /* End class. */

/**
 * Function to map state to Component props.
 */
const mapStateToProps = (inState) => {
	return {
	  	mVisible : inState.navigationState.subscriptionModalVisible
	};
};  
  
// Export components.
export default connect(mapStateToProps)(Subscription);
