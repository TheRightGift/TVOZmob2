/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    StatusBar,
    Platform,
} from "react-native";


import Orientation from "react-native-orientation";
import Video from "react-native-video";
// import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import DeviceInfo from 'react-native-device-info';
import { connect } from "react-redux";
import Network from '../Network';

import { Container, Header, Content, Title, Button, Left, Body, Item} from "native-base";
import Subscription from '../Subscription';
import Core from "../../Core";


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

//let FORWARD_DURATION = 7;

class VideoPlayer extends React.Component {

  	constructor(props) {
		super(props);
		this.state = { 
			paused: false,
            volume: 0.5,
            vodId: this.props.navigation.state.params.id,
			userId: this.props.user[0]['id'],
			uniqueId: DeviceInfo.getUniqueId()
        };
  	}

    componentDidMount() {
        StatusBar.setHidden(true);
        Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }
    componentWillMount() {
        StatusBar.setHidden(true);
        Orientation.lockToLandscape();
    }

    onVideoEnd() {
        this.videoPlayer.seek(0);
        this.setState({ key: new Date(), currentTime: 0, paused: true });
    }

    onVideoLoad(e) {
        this.setState({ currentTime: e.currentTime, duration: e.duration });
    }

    onProgress(e) {
        this.setState({ currentTime: e.currentTime });
    }

    playOrPauseVideo(paused) {
        this.setState({ paused: !paused });
    }
    onBackward(currentTime) {
        let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
        this.videoPlayer.seek(newTime);
        this.setState({ currentTime: newTime })
    }
    onForward(currentTime, duration) {
        if (currentTime + FORWARD_DURATION > duration) {
            this.onVideoEnd();
        } else {
            let newTime = currentTime + FORWARD_DURATION;
            this.videoPlayer.seek(newTime);
            this.setState({ currentTime: newTime });
        }
    }
    getCurrentTimePercentage(currentTime, duration) {
        if (currentTime > 0) {
            return parseFloat(currentTime) / parseFloat(duration);
        } else {
            return 0;
        }
    }

    onProgressChanged(newPercent, paused) {
        let { duration } = this.state;
        let newTime = newPercent * duration / 100;
        this.setState({ currentTime: newTime, paused: paused });
        this.videoPlayer.seek(newTime);

    }
    onLayout(e) {
        const { width, height } = Dimensions.get('window')
    }

    goBack = () => {
        this.props.navigation.goBack();
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }
    //navigation options
    static navigationOptions = { header: null }

    // render
    render() {
        let { onClosePressed, video} = this.props;
        let { currentTime, duration, paused, volume } = this.state;
        const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;
        console.log(Core.streamURL+this.props.navigation.state.params.videoFilename+'/index.m3u8')

        //if(this.props.serverConn){            
            if(this.props.sub){
                return (
                    <View style={styles.fullScreen}>        
                        <Video
                                ref={videoPlayer => this.videoPlayer = videoPlayer}
                                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                onError={this.videoError}               // Callback when video cannot be loaded
                                source={{ uri: Core.streamURL+this.props.navigation.state.params.videoFilename+'/index.m3u8' }}
                                //source={require('../../img/knives.mp4')}
                                resizeMode="contain"
                                controls={true}
                                style={Platform.OS === "android" ? styles.videoContainerAndroid : styles.videoContainerIOS} />
                        
                    </View>
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
        //}
        // } else {
        //     return (
        //         <Container>		
        //             <Header style={styles.header}>
        //                 <Body>
        //                     <Title style={styles.centre}>{this.props.navigation.state.params.title}</Title>
        //                 </Body>
        //             </Header>				
        //             <Content padder>
        //                 <Network/>
        //             </Content>
        //         </Container>
        //     );
        // }
            
    }
}


// styles
const styles = StyleSheet.create({

    fullScreen: {
        flex: 1,
        backgroundColor: "black"
    },
    videoView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    videoContainerAndroid: {
        height: "100%",
        width: "100%"
    },
    videoContainerIOS: {
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
        minWidth: Dimensions.get('window').height,
        minHeight: Dimensions.get('window').width,
        width: Dimensions.get('screen').height,
        height: Dimensions.get('screen').width,

        transform: [{ rotate: '90deg' }],
    },
    videoIcon: {
        fontSize: 50,
        color: "#2064a4"
    },
    pauseImageWrapper: {
        alignItems: 'center',
        alignSelf: 'center',
        position: "absolute",
    },
    backButtonWrapper: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: "flex-end"
    },
    controller: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    progressBar: {
        alignSelf: "stretch",
        margin: 20
    },

});

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
export default connect(mapStateToProps)(VideoPlayer);