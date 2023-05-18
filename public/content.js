/* global chrome */
console.log("contentScript loaded");
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log("hello in content: " + request.message);
  sendResponse({ status: "hello from the content" });
});
