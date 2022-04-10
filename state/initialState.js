export default initialState = {
  user: {
    userData: [],
    userPaymentData: [],
    subscribed: false
  },
  
  serverState : {
    connection : false,
    comStatus: false,
    serverSessionId: ''
  },

  navigationState: {
    forgotPassword: false,
    signedIn: false,
    checkedSignIn: true,
    subscriptionModalVisible: false
  }, 
  data: {
    vodData: [],
    OngoingTvData: [],
    ScheduledTvData: [],
    tagData: [],
  }

  /*gameData : {
    asked : "?????",
    answered : "?????",
    points : "?????",
    right : "?????",
    wrong : "?????",
    totalTime : "?????",
    fastest : "?????",
    slowest : "?????",
    average : "?????"
  },

  question : {
    answerButtonPrimary : [ true, true, true, true, true ],
    answerButtonDanger : [ false, false, false, false, false ],
    answerButtonLabels : [ null, null, null, null, null, null ],
    currentQuestion : null,
    selectedAnswer : -1
  },

  modals : {
    namePromptVisible : false,
    endGameVisible : false,
    adminVisible : false,
    endGameMessage : null,
    isAdmin : false,
    currentStatus : ""
  },

  playerInfo : {
    id : null,
    name : null
  }*/

};
