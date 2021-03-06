/**
 * @file background.js
 * @param {*} tabId
 * @param {*} changeInfo
 * @param {*} tab
 */
function listener(tabId, changeInfo, tab) {
  var status = changeInfo.status
  if (status === 'completed') {
    if (tab.url.search("nbatopshot.com/listings/p2p") > -1){
      chrome.tabs.executeScript(tab.id, { file: 'scripts/content_script.js' });
    }
  }
}
chrome.tabs.onUpdated.addListener(listener);

/**
 * onMessageListener
 * @param {*} message
 * @param {*} sender
 * @param {*} sendResponse
 */
const onMessageListener = (message, sender, sendResponse) => {
  // console.log(message, sender, sendResponse);
  switch (message.type) {
    case 'bglog':
      console.log(message.obj);
      break;

    default:
      // console.log(message.obj);
      break;
  }
  switch(message.text) {
    case 'close':
      var tabId = sender.tab.id;
      console.log("Closing tab id", tabId);
      chrome.tabs.remove(tabId, function() {
        console.log("Closed the tab.");
      });
      break
    default:
      break;
  }
  return true;
};
chrome.runtime.onMessage.addListener(onMessageListener);
