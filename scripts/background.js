/**
 * @file background.js
 * @param {*} tabId
 * @param {*} changeInfo
 * @param {*} tab
 */
function listener(tabId, changeInfo, tab) {
  if (tab.url.search("://www.nbatopshot.com/listings/p2p/") > -1){
    chrome.tabs.executeScript(tab.id, {file: 'scripts/content_script.js'});
  }
}
chrome.tabs.onUpdated.addListener(listener);

/**
 * onMessageListener
 * @param {*} message
 * @param {*} sender
 * @param {*} sendResponse
 */
var onMessageListener = function (message, sender, sendResponse) {
  switch (message.type) {
    case 'bglog':
      console.log(message.obj);
      break;
  }
  return true;
};
chrome.runtime.onMessage.addListener(onMessageListener);
