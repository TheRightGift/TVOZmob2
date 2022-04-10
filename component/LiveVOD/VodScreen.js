import React from "react";
import { StyleSheet, Text, StatusBar, FlatList, Image, TouchableOpacity, Dimensions, Alert, ScrollView, ActivityIndicator } from "react-native";

import { Item, Input, Content, Container, Header, Button, Left, Title, Body } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import Orientation from "react-native-orientation";
import { Overlay, ListItem } from 'react-native-elements';
import Core from "../../Core";
import { commStatus } from "../../state/actions";
import store from "../../state/store";
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
	imgBack: {   
		width: width - 200,
		height: height / 4,
		alignItems: 'center',
		resizeMode: 'contain'
	},
	noContent: {
		color: '#777777',
		marginTop: height / 3,
		textAlign: 'center',
	},
	txtWhiteColor: {
		color: '#fff',
		marginRight: 0,

	},
	headMenu: {
		marginRight: 3,
	},
	loader: {
        height: height / 6,
        justifyContent: 'center',
		alignItems: 'center',
		width: '30%'
	},
	vodContent: {
		paddingTop: '1%'
	},
	scrolStyle: { 
		padding: 0,
		width:width / 1.5,
		height: height / 1.1,
	},
	iconStyle: {
		fontSize:15,
		color: "#fff",
		marginLeft: 3
	},
	blackIconStyle: {
		fontSize:15,
		color: "#444",
		marginLeft: 3
	}
});

/**
 * Main class of this component.
 */
class VodScreen extends React.Component {
	componentWillMount() {
        Orientation.lockToPortrait();
	}
	/**
	 * Constructor.
	 */
	constructor(inProps) {

		super(inProps);
		this.state = {
			vods: this.props.vods,
			modalVisible: false,
			pin: '',
			catIsVisible: false,
			yrIsVisible: false,
			VODshowing: 'All',
			yrShowing: 'Year',
			uniqueId: DeviceInfo.getUniqueId()
		};
		
	} /* End constructor. */

	setModalVisible(visible) {
		this.setState({modalVisible: visible});
	}
	
	showCatMenu(visible) {
		this.setState({catIsVisible: visible});
		this.setState({yrIsVisible: false});
	}

	showYrMenu(visible) {
		this.setState({yrIsVisible: visible});
		this.setState({catIsVisible: false});
	}

	catToShow(cat) {
		this.setState({catIsVisible: false});
		this.setState({VODshowing: cat});
		this.setState({yrShowing: 'Year'});
		store.dispatch(commStatus(true));//start loader

		if(cat == 'All'){
			this.setState({vods: this.props.vods});			
		} else {
			let searchedVod = this.props.vods.filter(ele => ele.tags.includes(cat));
			this.setState({vods: searchedVod});			
		}
		store.dispatch(commStatus(false));//stop loader
	}

	yrToShow(yr) {		
		this.setState({yrIsVisible: false});
		this.setState({VODshowing: 'All'});
		store.dispatch(commStatus(true));//start loader
		//const uniqueId = this.state.uniqueId;

		if(yr == 'All'){
			this.setState({yrShowing: 'Year'});
			this.setState({vods: this.props.vods});
			// const authData = {
			// 	mac: uniqueId
			// }
			// Core.io.emit("getVOD", { authData });
		} else {
			this.setState({yrShowing: yr});
			let searchedVod = this.props.vods.filter(ele => ele.released.includes(yr));
			this.setState({vods: searchedVod});
			// const searchPara = {
			// 	yr: yr,
			// 	mac: uniqueId
			// }			
			// Core.io.emit("searchVODYr", { searchPara });//use socket to send subscribePIN to server
		}
		store.dispatch(commStatus(false));//stop loader
	}

	searchByMovieTitle = (text) => {
		store.dispatch(commStatus(true));//start loader
		let textLen = text.length;

		if(textLen > 0) {
			var regex = new RegExp( text, 'i' );
			let searchedVod = this.props.vods.filter(ele => ele.title.match(regex));
			this.setState({vods: searchedVod});
		} else {
			this.setState({vods: this.props.vods});
		}
		store.dispatch(commStatus(false));//stop loader
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
			this.loginErr();
		}  else {
			
			const uniqueId = this.state.uniqueId;
			
			const subscribePIN = {
				pin: pinVal,
				mac: uniqueId
			}			
			Core.io.emit("subscribe", { subscribePIN });//use socket to send subscribePIN to server
		
		}		
	}

	loginErr(){
		Alert.alert(
			'Subscription Status',
			'Invalid PIN!',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				}
			],
			{cancelable: false}
		)
	}

	componentDidMount() {
		Core.userSubExpiration(); 
		//this.setState({vods: this.props.vods});
	}


	/**
	 * Component render().
	 */
	render() {	
		const yearList = [
			{
			  	yr: 'All'
			},
			{
			  	yr: '2020'
			},
			{
				yr: '2019'
			},
			{
				yr: '2018'
			},
			{
				yr: '2017'
			},
			{
				yr: '2016'
			},
			{
				yr: '2015'
			},
			{
				yr: '2014'
			},
			{
				yr: '2013'
			},
			{
				yr: '2012'
			},
		]
		
		if(this.props.serverConn){
			if(this.props.sub){
				let vids;
				if(this.state.vods.length > 0){
					vids = this.state.vods;
				} else {
					vids = this.props.vods;//this.state.vods;
				}				
				let vodLen = vids.length;
				let cont;
				if(vodLen < 1){
					cont = <Text style={styles.noContent}>No Video on Demand.</Text>
				} else {
					cont = <FlatList
								numColumns={3}
								data={vids}
								renderItem={({ item }) => (
									<TouchableOpacity style={{flex:1/3, aspectRatio:1/1.5, marginBottom: '6%'}} onPress={() => {this.props.navigation.navigate('VODdetailScreen', {id : item._id, title: item.title, videoFilename: item.videoFilename, summary: item.summary, imgLandscape: item.imgLanscape, artistes: item.artistes, dir: item.dir, dislike: item.dislikedUsers.length, genre: item.genre, likes: item.likedUsers.length, released: item.released, summary: item.summary, viewing: item.viewing, views: item.views });}}>
										<Image style={{flex: 1, width: '98%', margin: '1%'}} resizeMode='cover' source={{ uri: Core.appServerURL+'/img/'+item.imgPortrait}}></Image>
										<Text  numberOfLines = { 1 } ellipsizeMode = 'middle' style={{fontSize: 12, fontWeight: 'bold', color: '#900C3F', paddingLeft: '2%'}}>{item.title}</Text>
										<Text style={{fontSize: 10,  color: '#900C3F', paddingLeft: '2%'}}>{item.released}</Text>
									</TouchableOpacity>
								)}
								keyExtractor={item => item._id}
							/>	
				}
				return (
					<Container>
						<Header searchBar rounded style={styles.header}  iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
							<Left style={styles.headMenu}>
								<Button iconRight transparent onPress={() => { this.showCatMenu(true);}} >
									<Text style={styles.txtWhiteColor} numberOfLines = { 1 } ellipsizeMode = 'middle'>{this.state.VODshowing}</Text> 
									<Icon name='arrow-down' style={styles.iconStyle}/>
								</Button>
							</Left>
							<Left style={styles.headMenu}>
								<Button iconRight transparent onPress={() => { this.showYrMenu(true);}} >
									<Text style={styles.txtWhiteColor}>{this.state.yrShowing}</Text> 
									<Icon name='clock'  style={styles.iconStyle}/>
								</Button>
							</Left>
							<Item>      
								<Icon name="search"  style={styles.blackIconStyle}/>      				
								<Input placeholder="Search" onChangeText={val => this.searchByMovieTitle(val)}/>
							</Item>
										
						</Header>

						<Content style={styles.vodContent}>
							{cont}
						</Content>

						<Overlay overlayStyle={styles.scrolStyle} isVisible={this.state.catIsVisible} onBackdropPress={() => this.setState({ catIsVisible: false })}>
							{/* <ScrollView> */}
							<>
								<ListItem
									key={-1}
									title='All'
									bottomDivider
									chevron
									onPress={() => {this.catToShow('All')}}
								/>
								{
									this.props.tags.map((item, i) => (
										
										<ListItem
											key={i}
											title={item.tag}
											bottomDivider
											chevron
											onPress={() => { this.catToShow(item.tag);}}
										/>
									))
								}
							</>
							{/* </ScrollView> */}
						</Overlay>
						<Overlay overlayStyle={styles.scrolStyle} isVisible={this.state.yrIsVisible} onBackdropPress={() => this.setState({ yrIsVisible: false })}>
							<ScrollView>
								{
									yearList.map((item, i) => (
										<ListItem
											key={i}
											title={item.yr}
											bottomDivider
											chevron
											onPress={() => { this.yrToShow(item.yr);}}
										/>
									))
								}
							</ScrollView>
						</Overlay>
						<Overlay isVisible={this.props.serverComStat} overlayStyle={styles.loader}>
							<ActivityIndicator size="large"/>
						</Overlay>
					</Container>
				);
			} else {
				return(
					<Container>
						
						<Header style={styles.header}  iosBarStyle={"light-content"} androidStatusBarColor="#900C3F">
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
								<Title>TVOZ - VOD</Title>
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
		serverComStat : inState.serverState.comStatus,
		vods: inState.data.vodData,
		tags: inState.data.tagData,
		paymentStatus: inState.user.userPaymentData,
		sub: inState.user.subscribed
	};
};

// Export components.
export default connect(mapStateToProps)(VodScreen);
