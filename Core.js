import io from "socket.io-client";
import { connectionStatus, setOnTvData, setVodData, forgotPasswordStatus, updateVodData, signedInStatus, clearOnTvData, setTagData, sessionId, getUserSub } from "./state/actions";
import store from "./state/store";
import Database from './database';
import DeviceInfo from 'react-native-device-info';
// import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
const db = new Database();


const Core = {
    // Our Socket.io connection to the server.
    io : null,
	appServerURL : "http://192.168.43.2:3000", //http://192.168.0.105:3000",//, , http://192.168.0.105:3000
	streamURL: "http://192.168.0.105/hls/",
    startup : () => {
		//initialize Db 
		db.initDB();

		let mySessionId;

		

		//establish connection to server
		Core.io = io(Core.appServerURL);
		
		Core.io.on("connected", function(data){
			mySessionId = data.userSessionId;	
			store.dispatch(sessionId(mySessionId));
			//get Connection status.
			store.dispatch(connectionStatus(true));
			
			//does user ve active sub
			db.lastPaymentHistory().then((res) => {												
				if(res.length > 0){ //yes
					const authData = {
						mac: DeviceInfo.getUniqueId(),
						version: DeviceInfo.getVersion()
					}
					Core.io.emit("getTagsVODsTvs", { authData });//get data
	
					let expireDate = new Date(res[0]['dateExpire']);
					let today = new Date();
					
					if(expireDate > today){
						store.dispatch(getUserSub(true));
					} else {
						store.dispatch(getUserSub(false));
					}
					
					store.dispatch(getUserPaymentData(res[0]));
				}				
				
			}).catch((err) => {
				//console.log(err);
			});		
		});

		Core.io.on('connect_failed', function(){
			store.dispatch(connectionStatus(false));
		});
    
    	Core.io.on("disconnect", function(){
			//get Connection status.
			  store.dispatch(connectionStatus(false));
		});

		Core.io.on("wow", function(){
			alert('wow');
		});

		Core.io.on("navToForgotPass", Core.navToForgotPass);
		Core.io.on("loginErrorr", Core.loginError);
		Core.io.on("liveTvUpdate", Core.liveTvUpdate);
		Core.io.on("userLogout", Core.userLogout);		
		Core.io.on("ongoingTv", (data) => {
			let tvLen = data.length;
			
            if(tvLen > 0){				
				store.dispatch(setOnTvData(data));							
            } else {//no program returned
                //TODO: no tv program
            }
        });
        Core.io.on("vods", (data) => {	
			store.dispatch(setVodData(data));
			//store.dispatch(commStatus(false));
		}); 
		
		Core.io.on("tags", (data) => {	
			store.dispatch(setTagData(data));
		}); 
		Core.io.on('vodViewUpdate', (data) => {
			store.dispatch(updateVodData(data));
		});
		Core.io.on("userLogout", Core.userLogout);
		
	},
	userSubExpiration: () => {
		
		const st = store.getState();

		let expireDate = st.user.userPaymentData.dateExpire;
		expireDate = new Date(expireDate);
		let today = new Date();

		if(today.getFullYear() == expireDate.getFullYear() && today.getMonth() == expireDate.getMonth() && today.getDate() == expireDate.getDate()){
			setInterval(() => {
				let tDay = new Date();
				if((tDay.getHours() == expireDate.getHours() && tDay.getMinutes() >= expireDate.getMinutes()) || tDay.getHours() > expireDate.getHours()){
					store.dispatch(getUserSub(false));
				}				
			}, 60000);//every 1 minute
		}
		
	},
	userLogout: () => {
		//empty user table
		db.emptyDB().then((data) => {
			if (data) {			
				//reset store
				store.dispatch(signedInStatus(false));
			} 
		}).catch((err) => {
			console.log(err);
		})		
	},
	
	getLiveTv: function(){
		db.listTvProg().then((res) => {
			store.dispatch(setOnTvData(res));	
		}).catch((err) => {
			console.log(err);
		})
	},
	emptyLiveTvRedux: () => {
		store.dispatch(clearOnTvData());
	},
	liveTvUpdate: function(data){
		if(data){
			let a, dataLen = data.length;
			for(a = 0, a < dataLen; a++;){
				db.updateLiveTv(data[a]).then((result) => {
					console.log(result);
				}).catch((err) => {
					console.log(err);
				})	

				if(a == (dataLen - 1)){
					Core.emptyLiveTvRedux();//empty live tv data in store

					Core.getLiveTv();//repopulate liveTv data in store
				}
			}
		}
	},
	navToForgotPass: function(){		
		store.dispatch(forgotPasswordStatus(true));
	},
	loginError: () => {
		//store.dispatch(signedInStatus(true));
		//return store.getState().navigationState.signedIn;
	},

}

export default Core;