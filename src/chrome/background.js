chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === 'activate') {
    chrome.pageAction.show(sender.tab.id);
  }
});