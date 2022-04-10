import React from "react";
import { StyleSheet, TouchableOpacity, ImageBackground, Dimensions  } from "react-native";

import { Container, Header, Content, Card, CardItem, Title, Text, Button, Left, Body, Right, Footer } from "native-base";
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { updateLiveData } from "../../state/actions";
import store from "../../state/store";
import Core from "../../Core";
import Network from '../Network';
import Subscription from '../Subscription';
import { RelatedVOD } from "./RelatedVOD";

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
	  width:"100%"
	},
	overlay: {
		backgroundColor: "rgba(255, 255, 255, .6)", 
		height: '100%', 
		width: null, 
		flex: 1, 
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center' // Used to set Text Component Horizontally Center
	},
	centre : {
		textAlign: 'center',
	},
	overlayIcon:
    {
		fontSize: 50,
		color: "#2064a4"
	},
	header: {
		backgroundColor: '#900C3F',
	},
});


/**
 * Main class of this component.
 */
class TvdetailScreen extends React.Component {

	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			tvId: this.props.navigation.state.params.id,
			userId: this.props.user[0]['id'],
			uniqueId: DeviceInfo.getUniqueId(),
			views: 0,
			relatedVOD: []
		};
		
	} /* End constructor. */

	getThisVODToState = () => {
		let tg = []
		this.props.tvs.map((item, index) => {			
			if (item._id == this.props.navigation.state.params.id) {	
				let views = item.viewingUsers.length;			
				this.setState({views: views});
				//this.setState({vod: item})
				tg = item.tags
			} 	
		});

		let arrToState = [];
		this.props.vods.map((item, index) => {
			let nArr = [];
			let intersection = tg.filter(x => item.tags.includes(x));
			if(intersection.length > 0 && item._id != this.props.navigation.state.params.id){
				nArr = item;
				nArr['matchNum'] = intersection.length;
				arrToState.push(nArr);
			}			
		});

		//sort the array desc order
		arrToState.sort(function(a,b) {
			return b['matchNum']-a['matchNum']
		});

		//limit the number of related videos to 12 and add to state
		this.setState({relatedVOD: arrToState.slice(0, 12)});
	}

	// onPress={() => {}}
	toTVPlayer = (tvId) => {
		let userId = this.state.userId;
		const uniqueId = this.state.uniqueId;

		const likedVODData = {
			userId: userId,
			tvId: tvId,
			mac: uniqueId,
		}			
		Core.io.emit("userViewedLive", { likedVODData });
		this.props.navigation.navigate('TvPlayer', {id : this.props.navigation.state.params.id, url: this.props.navigation.state.params.url});
		//this.props.navigation.navigate('VODPlayer', {id : this.props.navigation.state.params.id, title: this.props.navigation.state.params.title, videoFilename: this.props.navigation.state.params.videoFilename});
	}

	componentDidMount() {
		
		this.getThisVODToState();

		Core.userSubExpiration(); 

		//TODO: change to matvh liveTv
		Core.io.on('liveUpdate', (data) => {
			store.dispatch(updateLiveData(data));			

			this.props.tvs.map((item, index) => {
				
				if (item._id == this.props.navigation.state.params.id) {
					let views = item.viewingUsers.length;			
					this.setState({views: views});					
				} 	
			});
		});
	}

	/**
	 * Component render().
	 */
	render() {
		//TODO: if url is !empty show else inform the user .......I think i ve done this
		//TODO: show VOD under the last card related to the tags attached to this live Tv

		if(this.props.serverConn){
			if(this.props.sub){
				console.log(this.state.views)
				let url;
				if(this.props.navigation.state.params.url == ""){
					url = 	<TouchableOpacity style={styles.overlay}>
								<Text>Program not showing!</Text>
							</TouchableOpacity>;
				} else if(this.props.navigation.state.params.onGoing == "N"){
					url = 	<TouchableOpacity style={styles.overlay}>
								<Text>Program Starts at {this.props.navigation.state.params.time}</Text>
							</TouchableOpacity>;
				} else {
					
					url = 	<TouchableOpacity style={styles.overlay} onPress={() => {this.toTVPlayer(this.state.tvId)}}>
								<Text><Icon style={styles.overlayIcon} active name="youtube"/></Text>
							</TouchableOpacity>;
				}
				
				return (
					<Container>
						<Header style={styles.header} iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
							<Body>
								<Title style={styles.centre}>{this.props.navigation.state.params.title}</Title>
							</Body>
						</Header>
						<Content>
							<Card>
								<CardItem cardBody>
									<ImageBackground  style={{height: 200, width: null, flex: 1}} source={{ uri: Core.appServerURL+'/img/'+this.props.navigation.state.params.coverImg}}>
										{url}
									</ImageBackground>
								</CardItem>
								<CardItem bordered>
									<Left>
										<Button transparent>
											<Icon active name="clock"/>
											<Text>{this.props.navigation.state.params.time}</Text>
										</Button>
									</Left>
									<Body/>
									<Right>
										<Button transparent>
											<Icon active name="users"/>
											<Text>{this.state.views}</Text>
										</Button>
									</Right>
								</CardItem>
								<CardItem bordered>
									<Text style={styles.title}>RELATED VIDEOS</Text>
								</CardItem>
								<CardItem>
									<RelatedVOD relatedVOD={this.state.relatedVOD} navigation={this.props.navigation}/>
								</CardItem>
							</Card>					
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
						<Body>
							<Title style={styles.centre}>{this.props.navigation.state.params.title}</Title>
						</Body>
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
		vods: inState.data.vodData,
		tvs: inState.data.OngoingTvData,
		paymentStatus: inState.user.userPaymentData,
		user: inState.user.userData,
		sub: inState.user.subscribed
	};
};


// Export components.
export default connect(mapStateToProps)(TvdetailScreen);
