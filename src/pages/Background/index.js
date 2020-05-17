import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

window.onload = function () {
  let tabIdToPreviousUrl = {};
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url && changeInfo.url.match(/<regex>/g)) {
      var previousUrl = '';
      if (tabId in tab) {
        previousUrl = tabIdToPreviousUrl[tabId];
      }
      // If the domain is different perform action.
      if (previousUrl !== changeInfo.url) {
        // do something
      }
      // Add the current url as previous url
      tabIdToPreviousUrl[tabId] = changeInfo.url;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currTab = tabs[0];
      if (currTab) {
        chrome.tabs.sendMessage(currTab.id, {
          tabId,
          changeInfo,
          tab,
          tabIdToPreviousUrl,
        });
      }
    });
  });
};
