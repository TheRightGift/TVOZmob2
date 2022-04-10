import React, {Component} from "react";
import { StyleSheet, Text, Dimensions, Image, View, StatusBar} from "react-native";

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({	
	noNetContainer: {
        marginTop: height / 4.3,
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
	}
});


/**
 * Main class of this component.
 */

 class Network extends Component {
	/**
	 * Constructor.
	 */
	constructor(inProps) {
		super(inProps);
		
	} /* End constructor. */

	componentDidMount() {
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#900C3F');
	}
		
	/**
	 * Component render().
	 */
	render() {		
        return (
            <View style={styles.noNetContainer}>
                <Image source = {require('../img/noNetwork.png')} style={styles.imgBack}/>
                <Text style={styles.instructions}>Network disconnected!</Text>
            </View>
        );
	} /* End render(). */
} /* End class. */

// Export components.
export default Network;
