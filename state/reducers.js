import {
  CONNECTION_STATUS, COMM_STATUS, FORGOT_PASSWORD_STATUS, SIGNEDIN_STATUS, CHECKED_SIGNEDIN_STATUS, SET_VOD_DATA, SET_TAG, 
  SET_SCHEDULED_TV_DATA, SET_ONGOING_TV_DATA, UPDATE_VOD_DATA, GET_USER_DATA, GET_USER_PAYMENT_DATA, SERVER_SESSIONID,
  SET_SUBSCRIPTION_MODAL_VISIBILITY, GET_USER_SUB, UPDATE_LIVE_DATA
} from "./actions";



/**
 * Reducer for the connectionStatus branch of data in state screen.
 */
exports.connectionStatusReducer = function(inState = {}, inAction) {

  switch (inAction.type) {

    case CONNECTION_STATUS : {
      // Get current state.
      const connectionStatus = { ...inState };
      // Set ID.
      connectionStatus.connection = inAction.payload.connection;
      return { ... inState, ...connectionStatus };
    }

    case COMM_STATUS : {
      // Get current state.
      const commStatus = { ...inState };
      // Set ID.
      commStatus.comStatus = inAction.payload.comStatus;
      return { ... inState, ...commStatus };
    }

    case SERVER_SESSIONID : {
      // Get current state.
      const sessId = { ...inState };
      // Set ID.
      sessId.serverSessionId = inAction.payload.serverSessionId;
      return { ... inState, ...sessId };
    }

    default : { return inState; }

  } /* End switch. */

}; /* End connectionStatusReducer(). */

/**
 * Reducer for the forgotPasswordStatus branch of data in state screen.
 */
exports.navigationStateReducer = function(inState = {}, inAction) {

  switch (inAction.type) {

    case FORGOT_PASSWORD_STATUS : {
      // Get current state.
      const forgotPasswordStatus = { ...inState };
      // Set ID.
      forgotPasswordStatus.forgotPassword = inAction.payload.forgotPassword;
      return { ... inState, ...forgotPasswordStatus };
    }

    case SIGNEDIN_STATUS : {
      // Get current state.
      const signedInStatus = { ...inState };
      // Set signedIn.
      signedInStatus.signedIn = inAction.payload.signedIn;
      return { ... inState, ...signedInStatus };
    }

    case CHECKED_SIGNEDIN_STATUS : {
		// Get current state.
		const checkedSignedInStatus = { ...inState };
		// Set checkedSignIn.
		checkedSignedInStatus.checkedSignIn = inAction.payload.checkedSignIn;
		return { ... inState, ...checkedSignedInStatus };
    }

    case SET_SUBSCRIPTION_MODAL_VISIBILITY : {
		// Get current state.
		const subscriptionModalVisibility = { ...inState };
		// Set subscriptionModalVisible.
		subscriptionModalVisibility.subscriptionModalVisible = inAction.payload.subscriptionModalVisible;
		return { ... inState, ...subscriptionModalVisibility };
    }

    default : { return inState; }

  } /* End switch. */

}; /* End forgotPasswordStatusReducer(). */

/**
 * Reducer for the data.
 */
exports.dataReducer = function(inState = {}, inAction) {

  switch (inAction.type) {

    case SET_VOD_DATA : {
      // Store new VOD data.
      return { ...inState, ...{ vodData : inAction.payload.vodData } };
    }

    case SET_ONGOING_TV_DATA : {
      // Store new ongoing tv data.
      return { ...inState, ...{ OngoingTvData : inAction.payload.OngoingTvData } };
    }

    case SET_SCHEDULED_TV_DATA : {
      // Store new scheduled TV data.
      return { ...inState, ...{ scheTvData : inAction.payload.ScheduledTvData } };
    }

    case SET_TAG : {
      // Store new tag data.
      return { ...inState, ...{ tagData : inAction.payload.tagData } };
    }

    case UPDATE_VOD_DATA: {
		let nuVodData = [];
		
		inState.vodData.map((item, index) => {
			if (item._id !== inAction.payload.vodData._id) {
			// This isn't the item we care about - keep it as-is
			nuVodData.push(item);
			} else {
			nuVodData.push(inAction.payload.vodData)
			}		
		});
		// update VOD data.
		return { ...inState, ...{ vodData : nuVodData } };
	}
	
	case UPDATE_LIVE_DATA: {
		let nuLiveData = [];
		
		inState.OngoingTvData.map((item, index) => {
			if (item._id !== inAction.payload.OngoingTvData._id) {
				// This isn't the item we care about - keep it as-is
				nuLiveData.push(item);
			} else {
				nuLiveData.push(inAction.payload.OngoingTvData)
			}		
		});
		// update VOD data.
		return { ...inState, ...{ OngoingTvData : nuLiveData } };
    }

    default : { return inState; }

  } /* End switch. */

}; /* End dataReducer(). */

/**
 * Reducer for the user branch of data in state screen.
 */
exports.userReducer = function(inState = {}, inAction) {

  switch (inAction.type) {

    case GET_USER_DATA : {
      // Store user basic data.
      return { ...inState, ...{ userData : inAction.payload.userData } };
    }

    case GET_USER_PAYMENT_DATA : {
      //store user payment data
      return { ...inState, ...{ userPaymentData : inAction.payload.userPaymentData } };
    }

    case GET_USER_SUB : {
      //store user subscription data
      return { ...inState, ...{ subscribed : inAction.payload.subscribed } };
    }

    default : { return inState; }

  } /* End switch. */

}; /* End userReducer(). */


