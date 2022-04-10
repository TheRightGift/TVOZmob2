import React from "react";
import { StyleSheet, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";

import { Content } from "native-base";
import { Overlay  } from "react-native-elements";
import Core from "../../Core";

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	vodContent: {
		paddingTop: '1%'
	},
	noContent: {
		color: '#777777',
		marginTop: height / 3,
		textAlign: 'center',
	}
});

export class RelatedVOD extends React.Component {
    render() {
        let vids = this.props.relatedVOD;
        let cont;
        if(vids){
            let vodLen = vids.length;
            if(vodLen < 1){
                cont = <Text style={styles.noContent}>No Related Videos.</Text>
            } else {
                cont = <FlatList
                        numColumns={3}
                        data={vids}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{flex:1/3, aspectRatio:1/1.5, marginBottom: '6%'}} onPress={() => {this.props.navigation.push('VODdetailScreen', {id : item._id, title: item.title, videoFilename: item.videoFilename, summary: item.summary, imgLandscape: item.imgLanscape, artistes: item.artistes, dir: item.dir, dislike: item.dislikedUsers.length, genre: item.genre, likes: item.likedUsers.length, released: item.released, summary: item.summary, viewing: item.viewing, views: item.views });}}>
                                <Image style={{flex: 1, width: '98%', margin: '1%'}} resizeMode='cover' source={{ uri: Core.appServerURL+'/img/'+item.imgPortrait}}></Image>
                                <Text  numberOfLines = { 1 } ellipsizeMode = 'middle' style={{fontSize: 12, fontWeight: 'bold', color: '#900C3F', paddingLeft: '2%'}}>{item.title}</Text>
                                <Text style={{fontSize: 10,  color: '#900C3F', paddingLeft: '2%'}}>{item.released}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item._id}
                    />	
            }
            
        } else {
            cont = <Overlay isVisible={this.state.isVisible} overlayStyle={styles.loader}>
                        <ActivityIndicator size="large"/>
                    </Overlay>
        }
        return (
            <Content style={styles.vodContent}>
                {cont}
            </Content>
        )
    }
}