import React, {Component} from "react";
import { StyleSheet, Text, Dimensions, Modal, FlatList, View, ImageBackground} from "react-native";

import { Container, Header, Content, Button, ListItem, Left, Body, Right, Title, Item, Input, CardItem, Card} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from "react-redux";
import moment from "moment";
import { getUserPaymentData, setSubscriptionModalVisible } from "../state/actions";
import Subscription from './Subscription';
import store from "../state/store";
import Database from '../database';
import Network from './Network';

const db = new Database();

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#900C3F',
	},
	container: {
		backgroundColor: '#097ec8'
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
		marginTop: height / 4
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
	mainTxt: {
		color: '#097ec8',
		fontWeight: 'bold'
	},
	subTxt: {
		color: 'gray',
		fontSize: 11
	},
	transBackgrnd: {
		backgroundColor: 'rgba(52, 52, 52, 0.1)'
	},
	iconStyle: {
		fontSize:15,
		color: "#fff",
		// marginLeft: 3
	},
	bigIconStyle: {
		fontSize:20,
		color: "#fff",
		marginRight: 5
	},
	blackIconStyle: {
		fontSize:25,
		color: "#000",
		marginLeft: 9
	}
});

/**
 * Main class of this component.
 */

 class Settings extends Component {
	/**
	 * Constructor.
	 */
	constructor(inProps) {
		super(inProps);
		this.state = {
			modalVisible: false,
			paymentHistory: []
		}
		
	} /* End constructor. */
	
	setModalVisible(visible) {
		store.dispatch(setSubscriptionModalVisible(visible));
	}
	getSubscriptionHistory() {
		this.setState({modalVisible: !this.state.modalVisible})
	}

	componentDidMount() {
		db.paymentHistory().then((res) => {	
			this.setState({paymentHistory: res});
		}).catch((err) => {
			//console.log(err);
		});
	}
	
	/**
	 * Component render().
	 */
	render() {
		let subs = this.state.paymentHistory;
	
		if(this.props.serverConn){
			return(
				<Container>
					<Header style={styles.header} iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
						<Left>
							<Button transparent>
								<Icon name='cog' style={styles.bigIconStyle}/> 
								<Title> Settings</Title>
							</Button>
						</Left>
						<Body/>
					</Header>
					<Content >
						<ListItem itemDivider icon>
							<Left>
								<Button style={{ backgroundColor: "#007AFF" }}>
									<Icon active name="user"  style={styles.iconStyle}/>
								</Button>	
							</Left>
							<Body/>
						</ListItem> 
						<ListItem>
							<Left>
								<Text>NAME</Text>	
							</Left>
							<Body>
								<Text>{this.props.user[0]['firstname']} {this.props.user[0]['othername']} {this.props.user[0]['surname']}</Text>
							</Body>
							<Right/>
						</ListItem>
						<ListItem>
							<Left>
								<Text>PHONE No</Text>	
							</Left>
							<Body>
								<Text>{this.props.user[0]['phone']}</Text>
							</Body>
							<Right/>
						</ListItem>
						<ListItem >
							<Left>
								<Text>USERNAME</Text>	
							</Left>
							<Body>
								<Text>{this.props.user[0]['username']}</Text>
							</Body>
							<Right/>
						</ListItem>
						
						<ListItem itemDivider icon>
							<Left>
								<Button style={{ backgroundColor: "#007AFF" }}>
									<Icon active name="shopping-cart" style={styles.iconStyle}/>
								</Button>	
							</Left>
							<Body/>
						</ListItem>
						<ListItem icon>
							<Left>
								<Button style={{ backgroundColor: "#000000" }}>
									<Icon active name="credit-card"  style={styles.iconStyle} />
								</Button>
							</Left>
							<Body>
								<Text>Subscribe</Text>
							</Body>
							<Right>
								<Button transparent onPress={() => { this.setModalVisible(!this.props.mVisible); }}>
									<Text>Pay</Text>
									<Icon active name="caret-right" style={styles.blackIconStyle}/>
								</Button>
							</Right>
						</ListItem>
						<ListItem icon>
							<Left>
								<Button style={{ backgroundColor: "#FF9501" }}>
									<Icon active name="eye" />
								</Button>
							</Left>
							<Body>
								<Text>Subscription</Text>
							</Body>
							<Right>
								<Button transparent onPress={() => { this.getSubscriptionHistory(); }}>
									<Text>History</Text>
									<Icon active name="caret-right"  style={styles.blackIconStyle}/>
								</Button>
							</Right>
						</ListItem>	
					</Content>
					<View visible="false">
						<Subscription/>
					</View>
					<Modal  animationType="slide" transparent={false} visible={this.state.modalVisible} onRequestClose={() => {}}>
						<ImageBackground source={require('../img/tvozBkgrd.jpg')} style={{flex: 1}}>
							<Container style={styles.transBackgrnd}>
								<Header style={styles.header}>
									<Left>
										<Button transparent onPress={() => { this.getSubscriptionHistory(); }}>
											<Icon name="times" style={styles.bigIconStyle}/>
										</Button>	
									</Left>
									<Body>
										<Title>Subscription History</Title>
									</Body>
								</Header>
								<Content padder>								
										<FlatList
											numColumns={1}
											data={subs}
											renderItem={({ item }) => (
												<Card>
													<CardItem header bordered>
														<Left>
															<Text style={styles.mainTxt}>{item.digit}</Text>
														</Left>
														<Right>
															<Text>{item.numOfDays} days</Text>
														</Right>
													</CardItem>
													<CardItem>
														<Left>
															<Text style={styles.mainTxt}>From: </Text> 
															<Text style={styles.subTxt}>{moment(item.dateUsed).format('MMM Do YYYY')}</Text>
														</Left>
														<Right>
															<Text style={{flexDirection:'row', flexWrap:'wrap'}}>
															<Text style={styles.mainTxt}>To: </Text> 
															<Text style={styles.subTxt}>{moment(item.dateExpire).format('MMM Do YYYY')}</Text>
															</Text>														
														</Right>													  
													</CardItem>
												</Card>	
											)}
											keyExtractor={item => item.id}
										/>											
								</Content>
							</Container>		
						</ImageBackground>			
					</Modal>
				</Container>
			);
		} else {
			return (
				<Container>						
					<Header style={styles.header} iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
						<Left>
							<Button transparent>
								<Title>My Account</Title>
							</Button>
						</Left>
					</Header>
					<Content padder>
						<Network/>
					</Content>
				</Container>
				
			);
		}
	} /* End render(). */
} /* End class. */


/**
 * Function to map state to Component props.
 *
 * */
const mapStateToProps = (inState) => {
  return {
	serverConn : inState.serverState.connection,
	user: inState.user.userData,
	mVisible : inState.navigationState.subscriptionModalVisible
  };
};


// Export components.
export default connect(mapStateToProps)(Settings);
