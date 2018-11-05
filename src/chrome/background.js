chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === 'activate') {
    chrome.pageAction.show(sender.tab.id);
    chrome.pageAction.onClicked.addListener(() => {
      chrome.tabs.create({ url: 'https://github.com/z0h4n/crx-in-time-calculator' });
    });
  }
});