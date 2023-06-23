let skipAdCnt=0,
  overlayAdCnt=0,
  checkInterval=1000,
  reportCycle=30,
  errorCnt=0

function checkForSkipAd(){
  const skipButton = document.querySelector(".ytp-ad-skip-button");
  if (skipButton) 
    return skipButton;
  return undefined;
}

function checkForOverlayAdCloseButton(){
  const overlayCloseButton = document.querySelector(".ytp-ad-overlay-close-button");
  if (overlayCloseButton) 
    return overlayCloseButton;
  return undefined;
}

function startMonitoring(){
  const looper = setInterval(()=>{
    const skipButton = checkForSkipAd();
    if (skipButton){
      logger("Ad button found");
      try{
        skipButton.click();
        logger("Ad skipped");
        skipAdCnt+=1;
      }catch(e){
        logger(`FAILED to click on skipButton. Error: ${e.message}`);
        errorCnt+=1;
      }
    }
    const overlayCloseButton = checkForOverlayAdCloseBtn();
    if (overlayCloseButton){
      logger("Overlay Ad button found");
      try{
        overlayCloseButton.click();
        logger("Overlay Ad Closed");
        overlayAdCnt+=1;
      }catch(e){
        logger(`FAILED to click on closeOverlayBtn. Error: ${e.message}`);
        errorCnt+=1;
      }
    }
  },checkInterval)

  logger("Started monitoring");
}



chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  logger(`Message received: ${JSON.stringify(message)}`);
  switch(message.type){
    case "GET_STATS":
      sendResponse({
        type:"AD_SKIPPER",
        payload:{
          skipAdCnt,
          overlayAdCnt,
          errorCnt,
        }
      })
      break;
    default:
      sendResponse({
        type:"AD_SKIPPER",
        payload:`Message type ${message.type} UNKNOWN!`
      });
  }
})
function logger(msg){
  console.log('Auto Skip Ad ${msg}');
}

function status(){
  console.group(`Auto Skip Ad ${skipAdCnt} ${overlayAdCnt}`);
  console.log(`Skip ad button clicked: ${skipAdCnt}`);
  console.log(`Add overlay close button clicked: ${overlayAdCnt}`);
  console.groupEnd();
}

startMonitoring();