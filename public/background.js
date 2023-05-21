// background.js
let activeTabId;

chrome.browserAction.onClicked.addListener(function (tab) {
  activeTabId = tab.id;
  chrome.browserAction.setIcon({
    path: chrome.runtime.getURL("active.png"),
    tabId: tab.id,
  });
  chrome.tabs.sendMessage(tab.id, { action: "start" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture") {
    if (request.coords.width === 0 || request.coords.height === 0) {
      console.log("Zero dimension area, not capturing");
      return;
    }
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = request.coords.width;
        canvas.height = request.coords.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          request.coords.x,
          request.coords.y,
          request.coords.width,
          request.coords.height,
          0,
          0,
          request.coords.width,
          request.coords.height
        );
        downloadScreenshot(canvas.toDataURL());
        sendResponse({ result: "captured" });
      };
      img.src = dataUrl;
    });
  }
  // After capturing, stop listening for mouse events and switch back to the inactive icon.
  chrome.tabs.sendMessage(activeTabId, { action: "stop" });
  chrome.browserAction.setIcon({
    path: chrome.runtime.getURL("inactive.png"),
    tabId: activeTabId,
  });
  return true; // Will respond asynchronously
});

function downloadScreenshot(dataUrl) {
  const link = document.createElement("a");
  link.download = "screenshot.png";
  link.href = dataUrl;
  link.click();
}
