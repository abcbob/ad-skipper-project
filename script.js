let currentTab,
  skip = document.getElementById("skip"),
  overlay = document.getElementById("overlay"),
  errors = document.getElementById("errorCnt")

function logger(msg){
  console.log(`Auto Skip Ad popup: ${msg}`);
}

function displayStats(payload){
  const {skipAdCnt, overlayAdCnt, errorCnt} = payload;
  if (skip){
    skip.innerHTML = skipAdCnt;
  }
  if (overlay){
    overlay.innerHTML = overlayAdCnt;
  }
  /*if (errors){
    errors.innerHTML = errorCnt
  }*/
}

function turnOn(){
  chrome.action.setBadgeText({
    text:"ON"
  });

}

function turnOff(){
  chrome.action.setBadgeText({
    text:"OFF"
  });
}

function requestStats(){
  try{
    if (currentTab){
      chrome.tabs.sendMessage(
        currentTab.id,{
          type:"GET_STATS"
        },
        undefined,
        function(response){
          if (response){
            switch (response.type){
              case "AD_SKIPPER":
                displayStats(response.payload);
                turnOn();
                break;
              default:
                logger(`Response type ${response.type} NOT SUPPORTED!`)
            }
          } else if (chrome.runtime.lastError){
            turnOff();
          }
        }
      )
    }else{
      logger("ERROR requestStats: currentTab is UNDEFINED");
    }
  }catch(e){
    logger(`ERROR [requestStats]: ${e.message}`);
  }
}

function getCurrentTab(){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  },function(tabs){
    currentTab = tabs[0];
    if (currentTab) 
        requestStats();
  })
}

getCurrentTab();

logger("Started");