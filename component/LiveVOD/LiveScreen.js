import React, {Component} from "react";
import { StyleSheet, Text, FlatList, Dimensions, Image, Alert } from "react-native";
import { Body, ListItem, Thumbnail, Segment, Content, Container, Header, Button, Left, Right, Title, Icon} from "native-base";
// import { getUserPaymentData } from "../../state/actions";
// import store from "../../state/store";
import { connect } from "react-redux";
import Core from "../../Core";
// import { TvDetailsScreen } from "./TvDetailsScreen";
import DeviceInfo from 'react-native-device-info';
import Orientation from "react-native-orientation";
import Database from '../../database';
import Network from '../Network';
import Subscription from '../Subscription';

const db = new Database();
let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#900C3F',
	},
	container: {
		backgroundColor: '#097ec8'
	},
	text: {
		color: '#333333',
	},
	segment: {
		backgroundColor: '#900C3F'
	},
	button: {width: '35%', padding: 12, textAlign: 'center'},
	buttonTxt: {textAlign: 'center', padding: 8, color: '#900C3F'},
	blueTxt: {
		color: '#900C3F'
	},
	noPadding : {
		backgroundColor: '#E5F6FC',
	},
	whiteTxt: {
		color: 'white'
	},
	
	noContent: {
		color: '#777777',
		marginTop: height / 3,
		textAlign: 'center',
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
	centre: {
		textAlign: 'center',
	}
});

/**
 * Main class of this component.
 */
class LiveScreen extends Component {
	componentWillMount() {
        Orientation.lockToPortrait();
	}
	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			activePage: 1,
			loader: true,
			uniqueId: DeviceInfo.getUniqueId()
		}
		
	} /* End constructor. */	

	selectComponent = (activePage) => () => this.setState({activePage});

	componentDidMount() {		
		Core.userSubExpiration();
	}

	/**
	 * Component render().
	 */
	render() {
		let sessId = this.props.serverSessionId;
		
		if(this.props.serverConn){
			
			if(this.props.sub){
				//signal server of paying customer
				const uniqueId = this.state.uniqueId;
				const authData = {
					mac: uniqueId,
					sessionId: sessId
				}	
				Core.io.emit("userIsActive", { authData });

				//seperate ongoing Tv Programs from scheduled ones
				let a, tvLen = this.props.tv.length, tvCont = this.props.tv;
				const onGoingProgs = [];
				const scheduledProgs = [];
				
				for(a = 0; a < tvLen; a++){
					if(tvCont[a]['onGoing'] == 'Y'){
						const { _id, title, category, type, url, date, thumbImg, coverImg, onGoing  } = tvCont[a];
						let d = new Date(date);
						let h = d.getHours();
						let s = d.getMinutes();
						
						if(h < 10){
							let b = 0;
							h = b+h;
						}

						if(s == 0){
							s = '00';
						} else if(s < 10){
							let a = 0;
							s = a+s;
						} 
						let time = String(h+':'+s);
						
						onGoingProgs.push({
							_id,
							title,
							category,
							type,
							url,
							date,
							thumbImg,
							coverImg, 
							onGoing,
							time
						});
					} else if(tvCont[a]['onGoing'] == 'N') {
						const { _id, title, category, type, url, date, thumbImg, coverImg, onGoing  } = tvCont[a];
						
						let d = new Date(date);
						let h = d.getHours();
						let s = d.getMinutes();
						
						if(h < 10){
							let b = 0;
							h = b+h;
						}

						if(s == 0){
							s = '00';
						} else if(s < 10){
							let a = 0;
							s = a+s;
						} 
						let time = String(h+':'+s); 

						scheduledProgs.push({
							_id,
							title,
							category,
							type,
							url,
							date,
							thumbImg,
							coverImg, 
							onGoing, 
							time
						});
					}
				}
				
				let segCompo;
				
				if(tvLen < 1){
					segCompo = <Text style={styles.noContent}>No Live TV program.</Text>
				} else {
					if(this.state.activePage === 1){
						if(onGoingProgs.length > 0){
							segCompo = <FlatList
									style={styles.noPadding}
									numColumns={1}
									data={onGoingProgs}
									renderItem={({ item }) => (
										<ListItem thumbnail>
											<Left>
												<Thumbnail square source={{ uri: Core.appServerURL+'/img/'+item.thumbImg }} />
											</Left>
											<Body>
												<Text style={styles.text}>{item.title}</Text>
												<Text note numberOfLines={1} style={styles.text}>{item.type}</Text>
											</Body>
											<Right>
												<Button transparent onPress={() => {this.props.navigation.navigate('TvDetailsScreen', {id : item._id, title: item.title, type: item.type, url: item.url, date: item.date, time: item.time, coverImg: item.coverImg, onGoing: item.onGoing});}}>
													<Text style={styles.blueTxt}>Watch</Text>
												</Button>
											</Right>
										</ListItem>
									)}
									keyExtractor={item => item._id}
									/>	;
						} else {
							segCompo = <Text style={styles.noContent}>No Ongoing Live TV program. Please check scheduled Programs</Text>
						}
						
					} else {
						segCompo = <FlatList
									style={styles.noPadding}
									numColumns={1}
									data={scheduledProgs}
									renderItem={({ item }) => (
										
											<ListItem thumbnail>
												<Left>
													<Thumbnail square source={{ uri: Core.appServerURL+'/img/'+item.thumbImg }} />
												</Left>
												<Body>
													<Text style={styles.text}>{item.title}</Text>
													<Text note numberOfLines={1} style={styles.text}>{item.type}</Text>
												</Body>
												<Right>
													<Button transparent onPress={() => {this.props.navigation.navigate('TvDetailsScreen', {id : item._id, title: item.title, type: item.type, url: item.url, date: item.date, coverImg: item.coverImg, onGoing: item.onGoing, time: item.time});}}>
														<Icon style={styles.blueTxt} name="clock"/>
														<Text style={styles.blueTxt}>{item.time}</Text>
													</Button>
												</Right>
											</ListItem>
									)}
									keyExtractor={item => item._id}
									/>	;
					}
				}
				
				return (
					<Container>
						
						<Header hasSegment style={styles.header} iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
							<Left/>
							<Body>
								<Segment style={styles.segment}>
									<Button first active={this.state.activePage === 1} onPress={this.selectComponent(1)} style={styles.button}><Text style={[styles.buttonTxt, this.state.activePage === 1 ? styles.blueTxt: styles.whiteTxt]}>Ongoing</Text></Button>
									<Button last  active={this.state.activePage === 2} onPress= {this.selectComponent(2)} style={styles.button}><Text style={[styles.buttonTxt, this.state.activePage === 2 ? styles.blueTxt: styles.whiteTxt]}>Schedule</Text></Button>
								</Segment>
							</Body>
							<Right/>
						</Header>
						<Content padder>
							{segCompo}
						</Content>
					</Container>
				);
			} else {
				return(
					<Container>
						
						<Header style={styles.header} iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
							<Body>
								<Title>Subscription Status</Title>
							</Body>
						</Header>
						<Subscription/>
					</Container>
				);
			}			
		} else {
			return (
				<Container>						
					<Header style={styles.header}  iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
						<Left>
							<Button transparent>
								<Title>TVOZ - Live</Title>
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
 */
const mapStateToProps = (inState) => {
  	return {
		serverConn : inState.serverState.connection,
		serverSessionId : inState.serverState.serverSessionId,
		tv: inState.data.OngoingTvData,
		sub: inState.user.subscribed
  	};
};

// Export components.
export default connect(mapStateToProps)(LiveScreen);
