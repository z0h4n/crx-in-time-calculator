chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const urlObject = new URL(tab.url);
    if (urlObject.host.indexOf('greythr.com') !== -1 && urlObject.host.split('.') !== 'www' && urlObject.pathname !== '/login.do') {
      chrome.pageAction.show(tabId);
    }
  }
});

chrome.pageAction.onClicked.addListener(function () {
  msg('focus');
});

function msg(msg = '') {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: msg }, function (response) { });
  });
}