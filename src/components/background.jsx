/* global chrome */
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data) {
    console.log(data);
  }
  sendResponse({
    received: true,
  });
});
