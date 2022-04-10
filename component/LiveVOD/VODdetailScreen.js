import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from "react-native";

import { Container, Header, Content, Card, CardItem, Title, Text, Button, Icon, Left, Body, Right } from "native-base";
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import { updateVodData } from "../../state/actions";
import store from "../../state/store";
import Core from "../../Core";
import Network from '../Network';
import Subscription from '../Subscription';
import { RelatedVOD } from "./RelatedVOD";

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#900C3F',
	},
	title: {
		fontWeight: 'bold',
		
	},
	greyTxt: {
		color: '#777',
		fontSize: 12
	},
	container: {
	  width:"100%"
	},
	socialFdbk: {
		width: width / 3
	},
	midSocFdbk: {
		marginLeft: '0.005%',
		marginRight: '0.005%'
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
    }
});


/**
 * Main class of this component.
 */
class VODdetailScreen extends React.Component {

	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			vodId: this.props.navigation.state.params.id,
			userId: this.props.user[0]['id'],
			uniqueId: DeviceInfo.getUniqueId(),
			likes: 0,
			dislikes: 0,
			views: 0,
			relatedVOD: [],
			vod: []
		};
		
	} /* End constructor. */

	getThisVODToState = () => {
		let tg = []
		this.props.vods.map((item, index) => {
			if (item._id == this.props.navigation.state.params.id) {
				this.setState({likes: item.likedUsers.length});
				this.setState({dislikes: item.dislikedUsers.length});
				this.setState({views: item.views});
				this.setState({vod: item})
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


	componentDidMount() {	
		
		this.getThisVODToState();

		Core.io.on('vodUpdate', (data) => {
			store.dispatch(updateVodData(data));
			

			this.props.vods.map((item, index) => {
				
				if (item._id == this.props.navigation.state.params.id) {
					this.setState({likes: item.likedUsers.length});
					this.setState({dislikes: item.dislikedUsers.length});
					this.setState({views: item.views});					
				} 	
			});
		});

		Core.userSubExpiration(); 
	}

	userLiked = (vodId) => {
		let userId = this.state.userId;
		const uniqueId = this.state.uniqueId;
		
		const likedVODData = {
			userId: userId,
			vodId: vodId,
			mac: uniqueId
		}			
		Core.io.emit("userLikedVOD", { likedVODData });

		//process data to show user as waiting for auto rerendering thru redux is secs slow
		//any subsequent like by this user?
		if(this.state.vod['likedUsers'].includes(userId)){//subsequent like
			//remove from likedUsers[]
			let nuArr = this.state.vod['likedUsers'].filter(item => item !== userId);
			this.state.vod['likedUsers'] = nuArr;
		} else {//no subsequent like		
			//any subsequent dislike by this user?
			if(this.state.vod['dislikedUsers'].includes(userId)){//subsequent dislike 			                                
				//remove from dislikedUsers[]
				let nuArr = this.state.vod['dislikedUsers'].filter(item => item !== userId);	
				this.state.vod['dislikedUsers'] = nuArr;		
			}
			//add userId to likedUser[]
			this.state.vod['likedUsers'].push(userId);
		}
	}

	userDisliked = (vodId) => {
		let userId = this.state.userId;
		const uniqueId = this.state.uniqueId;
		
		const likedVODData = {
			userId: userId,
			vodId: vodId,
			mac: uniqueId
		}			
		Core.io.emit("userDislikedVOD", { likedVODData });

		//process data to show user as waiting for auto rerendering thru redux is secs slow
		//any subsequent like by this user?
		if(this.state.vod['dislikedUsers'].includes(userId)){//subsequent dislike	
			//remove from dislikedUsers[]
			let nuArr = this.state.vod['dislikedUsers'].filter(item => item !== userId);
			this.state.vod['dislikedUsers'] = nuArr;
		} else {//no subsequent dislike			
			//any subsequent like by this user?
			if(this.state.vod['likedUsers'].includes(userId)){//subsequent like 			                                
				//remove from likedUsers[]
				let nuArr = this.state.vod['likedUsers'].filter(item => item !== userId);	
				this.state.vod['likedUsers'] = nuArr;		
			}
			//add userId to dislikedUsers[]
			this.state.vod['dislikedUsers'].push(userId);
		}
	}

	toVODPlayer = (vodId) => {
		let userId = this.state.userId;
		const uniqueId = this.state.uniqueId;

		const likedVODData = {
			userId: userId,
			vodId: vodId,
			mac: uniqueId,
		}			
		Core.io.emit("userViewedVOD", { likedVODData });
		this.props.navigation.navigate('VODPlayer', {id : this.props.navigation.state.params.id, title: this.props.navigation.state.params.title, videoFilename: this.props.navigation.state.params.videoFilename});
	}

	/**
	 * Component render().
	 */
	render() {	

		let disLikes = 	this.state.vod['dislikedUsers'];
		let likes = 	this.state.vod['likedUsers'];
		
		let disLikesLen = 0;
		let likesLen = 0;
		if(disLikes){
			disLikesLen = disLikes.length;
			likesLen = likes.length;
		}

		if(this.props.serverConn){
			if(this.props.sub){
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
									<ImageBackground  style={{height: 200, width: null, flex: 1}} source={{ uri: Core.appServerURL+'/img/'+this.props.navigation.state.params.imgLandscape}}>
										<TouchableOpacity style={styles.overlay} onPress={() => {this.toVODPlayer(this.state.vodId)}}>
											<Text><Icon style={styles.overlayIcon} active name="logo-youtube"/></Text>
										</TouchableOpacity>
									</ImageBackground>
								</CardItem>
								<CardItem>
									<Left>
										<Button transparent style={styles.socialFdbk} onPress={() => { this.userLiked(this.state.vodId);}}>
											<Icon active name="thumbs-up" />
											<Text>{likesLen} Likes</Text>
										</Button>
									</Left>
									<Body>
										<Button transparent style={[styles.socialFdbk, styles.midSocFdbk]} onPress={() => { this.userDisliked(this.state.vodId);}}>
											<Icon active name="thumbs-down" />
											<Text>{disLikesLen} Dislikes</Text>
										</Button>
									</Body>
									<Right>
										<Button transparent>
											<Text>{this.state.views} Views</Text>
										</Button>
									</Right>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.title}>GENRE:</Text><Text style={styles.greyTxt}>{this.props.navigation.state.params.genre}</Text>
									</Body>
									<Right>
										<Text style={styles.title}>RELEASED</Text>
										<Text style={styles.greyTxt}>{this.props.navigation.state.params.released}</Text>
									</Right>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.title}>DIRECTOR(S) :</Text>
										<Text style={styles.greyTxt}>{this.props.navigation.state.params.dir}</Text>
									</Body>
								</CardItem>
								<CardItem>
									<Body>
										<Text style={styles.title}>TOP ARTISTES</Text>
										<Text style={styles.greyTxt}>{this.props.navigation.state.params.artistes}</Text>
									</Body>
								</CardItem>
								<CardItem bordered>
									<Text>
										{this.props.navigation.state.params.summary}
									</Text>
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
						
						<Header style={styles.header}>
							<Body>
								<Title>Subscription Status</Title>
							</Body>
						</Header>
						<Subscription/>
					</Container>
				);
			}
		} else {//no Server connection
			return (
				<Container>		
					<Header style={styles.header}>
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
		paymentStatus: inState.user.userPaymentData,
		user: inState.user.userData,
		sub: inState.user.subscribed
	};
};


// Export components.
export default connect(mapStateToProps)(VODdetailScreen);
