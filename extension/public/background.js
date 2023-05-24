let active = false;
let tabId = 0;

chrome.action.onClicked.addListener((tab) => {
  active = !active;
  tabId = tab.id;
  if (active) {
    chrome.action.setIcon({ path: "active.png", tabId: tabId });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.tabs.sendMessage(tabId, { message: "activate" });
  } else {
    chrome.action.setIcon({ path: "inactive.png", tabId: tabId });
    chrome.tabs.sendMessage(tabId, { message: "deactivate" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (image) {
      chrome.tabs.sendMessage(tabId, { message: "image", image });

      active = false;
      chrome.action.setIcon({ path: "inactive.png", tabId: tabId });
      chrome.tabs.sendMessage(tabId, { message: "deactivate" });
    });
  }
  if(request.message === 'image file'){
    console.log('image file')
    let path = "http://127.0.0.1:5000/digest";
    const formData = new FormData();
    formData.append('image', new Blob([request.image],{type: 'image/jpeg'}));
    fetch(path, {
      method:"POST",
      headers: {"Content-type":"application/json"},
      body: formData
    }).then(response => response.json())
      .then(data => console.log(data))
      .then(error => console.error(error));
  }
});
