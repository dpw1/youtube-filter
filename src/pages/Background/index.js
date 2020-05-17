import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

window.onload = function () {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log(changeInfo);

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
    console.log(request, sender, resp());

    /** Takes care of reloading new page when video is selected */
    chrome.tabs.reload(sender.tab.id);
  });
};
