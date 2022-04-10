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
    StatusBar
} from "react-native";
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import Orientation from "react-native-orientation";
// import Video from "react-native-video";
import { connect } from "react-redux";
// import {LivePlayer} from "react-native-live-stream";
// import KSYVideo from "react-native-ksyvideo";

import {Button} from "native-base";


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

let FORWARD_DURATION = 7;

class TvPlayer extends Component {

  	constructor(props) {
		super(props);
		this.state = { 
			paused: false,
			volume: 0.5,
        };
        
  	}

    componentDidMount() {
        Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }

    componentWillMount() {
        StatusBar.setHidden(true);
        Orientation.lockToLandscape();


        if(!this.props.serverConn || !this.props.sub){
            this.props.navigation.navigate('VODdetailScreen'); 
        }
    }

    // onVideoEnd() {
    //     this.videoPlayer.seek(0);
    //     this.setState({ key: new Date(), currentTime: 0, paused: true });
    // }

    // onVideoLoad(e) {
    //     this.setState({ currentTime: e.currentTime, duration: e.duration });
    // }

    // onProgress(e) {
    //     this.setState({ currentTime: e.currentTime });
    // }

    // playOrPauseVideo(paused) {
    //     this.setState({ paused: !paused });
    // }
    // onBackward(currentTime) {
    //     let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
    //     this.videoPlayer.seek(newTime);
    //     this.setState({ currentTime: newTime })
    // }
    // onForward(currentTime, duration) {
    //     if (currentTime + FORWARD_DURATION > duration) {
    //         this.onVideoEnd();
    //     } else {
    //         let newTime = currentTime + FORWARD_DURATION;
    //         this.videoPlayer.seek(newTime);
    //         this.setState({ currentTime: newTime });
    //     }
    // }
    // getCurrentTimePercentage(currentTime, duration) {
    //     if (currentTime > 0) {
    //         return parseFloat(currentTime) / parseFloat(duration);
    //     } else {
    //         return 0;
    //     }
    // }

    // onProgressChanged(newPercent, paused) {
    //     let { duration } = this.state;
    //     let newTime = newPercent * duration / 100;
    //     this.setState({ currentTime: newTime, paused: paused });
    //     this.videoPlayer.seek(newTime);

    // }
    // onLayout(e) {
    //     const { width, height } = Dimensions.get('window')
    // }

    goBack = () => {
        this.props.navigation.goBack();
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }
    // navigation options
    static navigationOptions = { header: null }

    // render
    render() {        
        return (
            <View>
            {/* <KSYVideo source={{uri: "rtmp://192.168.0.101:1935/live/"}}   // Can be a URL or a local file.
            // <KSYVideo source={{uri: '../img/knives.mp4'}}
                ref={(ref) => {
                    this.player = ref
                }}                                      // Store reference
            
                volume={1.0}                            
                muted={false}                           
                paused={false}                          // Pauses playback entirely.
                resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
                repeat={true}                           // Repeat forever.
                playInBackground={false}                // Audio continues to play when app entering background.
                progressUpdateInterval={250.0}          // Interval to fire onProgress (default to ~250ms)
                onLoadStart={this.loadStart}            // Callback when video starts to load
                onLoad={this.setDuration}               // Callback when video loads
                onProgress={this.setTime}               // Callback every ~250ms with currentTime
                onEnd={this.onEnd}                      // Callback when playback finishes
                onError={this.videoError}               // Callback when video cannot be loaded
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                style={styles.backgroundVideo} /> */}
                <VLCPlayer
                    ref={ref => (this.vlcPlayer = ref)}
                    style={{width: '100%', height: '100%'}}
                    videoAspectRatio="16:9"
                    paused={false}
                    source={{uri: "rtmp://192.168.0.101:1935/live/"}}
                    //source={{uri: "rtmp://192.168.0.101:1935/live/"}}
                    //  source={require('./img/knives.mp4')}
                    //  onProgress={this.onProgress.bind(this)}
                    //  onEnd={this.onEnded.bind(this)}
                    //  onBuffering={this.onBuffering.bind(this)}
                    //  onError={this._onError}
                    //  onStopped={this.onStopped.bind(this)}
                    //  onPlaying={this.onPlaying.bind(this)}
                    //  onPaused={this.onPaused.bind(this)}
                />
            </View>
        );
    }
}


// styles
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
});

  /**
 * Function to map state to Component props.
 */
const mapStateToProps = (inState) => {
	return {
		serverConn : inState.serverState.connection,
		sub: inState.user.subscribed,
		user: inState.user.userData
	};
};


// Export components.
export default connect(mapStateToProps)(TvPlayer);