chrome.runtime.onMessage.addListener(function (message, sender) {
  switch (message) {
    case 'activate extension':
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.onClicked.addListener(() => {
        chrome.tabs.create({ url: 'https://github.com/z0h4n/crx-in-time-calculator' });
      });
      break;
    default:
      console.error(`Unhandled onMessage Listener for message : ${message}`);
  }
});