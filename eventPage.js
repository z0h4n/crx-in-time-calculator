chrome.runtime.onMessage.addListener(function (message, sender) {
  switch (message) {
    case 'activate extension':
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, 'focus');
      });
      break;
    default:
      console.error(`Unhandled onMessage Listener for message : ${message}`);
  }
});