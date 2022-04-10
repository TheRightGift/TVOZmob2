/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  return (
    <View>
      <VLCPlayer
           ref={ref => (this.vlcPlayer = ref)}
           style={{width: '100%', height: 200}}
           videoAspectRatio="16:9"
           paused={false}
          source={require('./img/knives.mp4')}
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
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
