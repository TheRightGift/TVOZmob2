// Action types.  These must be unique in both name and value.
exports.CONNECTION_STATUS = "cs";
exports.COMM_STATUS = "cms";
exports.GET_USER_SUB = "gus";
exports.SERVER_SESSIONID = "ssi";
exports.FORGOT_PASSWORD_STATUS = "fps";//
exports.SIGNEDIN_STATUS = "ss";
exports.CHECKED_SIGNEDIN_STATUS = "css";
exports.UPDATE_VOD_DATA = "uvd";
exports.UPDATE_LIVE_DATA = "uld";
exports.SET_VOD_DATA = "vd";
exports.SET_TAG = "st";
exports.SET_ONGOING_TV_DATA = "otd";
exports.SET_SCHEDULED_TV_DATA = "std";
exports.GET_USER_DATA = "gud";
exports.GET_USER_PAYMENT_DATA = "gupd";
exports.SET_USER_PAYMENT_DATA = "supd";
exports.SET_SUBSCRIPTION_MODAL_VISIBILITY = "ssmv";

/**
 * For settings the connection Status.
 *
 * @param status The connection Status.
 */
exports.connectionStatus = (status) => {
  
  return {
    type : exports.CONNECTION_STATUS,
    payload : { connection : status }
  };

}; 

/**
 * For managing the communication status with server.
 *
 * @param status The comm Status.
 */
exports.commStatus = (status) => {
  
  return {
    type : exports.COMM_STATUS,
    payload : { comStatus : status }
  };

}; 

/**
 * For managing the id attached to session with server.
 *
 * @param status The sessionId.
 */
exports.sessionId = (status) => {  
  return {
    type : exports.SERVER_SESSIONID,
    payload : { serverSessionId : status }
  };

}; 



/**
 * For settings the forgotPass status.
 *
 * @param status The forgotPass Status.
 */
exports.forgotPasswordStatus = (status) => {
  return {
    type : exports.FORGOT_PASSWORD_STATUS,
    payload : { forgotPassword : status }
  };

};

/**
 * For settings the signedIn status.
 *
 * @param status The signedIn Status.
 */
exports.signedInStatus = (status) => {
  return {
    type : exports.SIGNEDIN_STATUS,
    payload : { signedIn : status }
  };

};

/**
 * For settings the checkedSignedIn status.
 *
 * @param status The signedIn Status.
 */
exports.checkedSignedInStatus = (status) => {
  return {
    type : exports.CHECKED_SIGNEDIN_STATUS,
    payload : { checkedSignIn : status }
  };

};

/**
 * For settings the subscription modal visibility.
 *
 * @param visible modal visible.
 */
exports.setSubscriptionModalVisible = (visible) => {

	return {
		type : exports.SET_SUBSCRIPTION_MODAL_VISIBILITY,
		payload : { subscriptionModalVisible : visible }
	};

}; 

/**
 * For updating the vod data.
 *
 * @param inVodData The vodData object returned by the server.
 */
exports.updateVodData = (inVodData) => {
  //console.log(inVodData);
  return {
    type : exports.UPDATE_VOD_DATA,
    payload : { vodData : inVodData }
  };

}; /* updateVodData(). */

/**
 * For updating the LiveTV data.
 *
 * @param inLiveData The OngoingTvData object returned by the server.
 */
exports.updateLiveData = (inLiveData) => {
  //console.log(inLiveData);
  return {
    type : exports.UPDATE_LIVE_DATA,
    payload : { OngoingTvData : inLiveData }
  };

}; /* updateVodData(). */

/**
 * For settings the vod data.
 *
 * @param inVodData The vodData object returned by the server.
 */
exports.setVodData = (inVodData) => {
  //console.log(inVodData);
  return {
    type : exports.SET_VOD_DATA,
    payload : { vodData : inVodData }
  };

}; /* setVodData(). */

/**
 * For settings the tag data.
 *
 * @param inTagData The tagData object returned by the server.
 */
exports.setTagData = (inTagData) => {
  //console.log(inTagData);
  return {
    type : exports.SET_TAG,
    payload : { tagData : inTagData }
  };

}; /* setVodData(). */

/**
 * For settings the tv data.
 *
 * @param inOnTvData The onTvData object returned by the server.
 */
exports.setOnTvData = (inOnTvData) => {
  return {
    type : exports.SET_ONGOING_TV_DATA,
    payload : { OngoingTvData : inOnTvData }
  };

}; /* setOnTvData(). */

/**
 * For clearing the tv data.
 *
 * @param none.
 */
exports.clearOnTvData = () => {
  return {
    type : exports.SET_ONGOING_TV_DATA,
    payload : { OngoingTvData : [] }
  };

}; /* clearOnTvData(). */

/**
 * For settings the user data.
 *
 * @param uData The userData object returned from DB.
 */
exports.getUserData = (uData) => {
  return {
    type : exports.GET_USER_DATA,
    payload : { userData : uData }
  };

}; /* getUserData(). */

exports.getUserSub = (dt) => {
	return {
		type : exports.GET_USER_SUB,
		payload : { subscribed : dt }
	};
}; 

/**
 * For settings the user Payment data.
 *
 * @param uPData The userPaymentData object returned from DB.
 */
exports.getUserPaymentData = (uPData) => {
  return {
    type : exports.GET_USER_PAYMENT_DATA,
    payload : { userPaymentData : uPData }
  };

}; /* getUserPaymentData(). */