import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

window.onload = function () {
  /** Disables icon if page is not youtube */
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (!/youtube\.com/.test(tab.url)) {
        chrome.browserAction.disable(tab.id);
      }
    });
  });

  /** Passes information of current page to Content */
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currTab = tabs[0];

        if (currTab) {
          chrome.tabs.sendMessage(currTab.id, {
            tabId,
            changeInfo,
            tab,
          });
        }
      });
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, resp) => {
    /** Takes care of reloading new page when video is selected */
    console.log('received message');

    if (request.message === 'reload') {
      chrome.tabs.reload(request.data.tabId);
    }
  });
};
