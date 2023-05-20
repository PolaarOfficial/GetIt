chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
    downloadScreenshot(dataUrl);
  });
});

function downloadScreenshot(dataUrl) {
  const link = document.createElement("a");
  link.download = "screenshot.png";
  link.href = dataUrl;
  link.click();
}