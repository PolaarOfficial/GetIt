//popup js will handle the initiation of the button click
// when the user draws a box, the popup js will disappear from active state
// and content js will handle the processing of the image

document.getElementById('drawBox').addEventListener('click', function() {
    // Send message to content script

    console.log('here')
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'Hello from the other side'});
    });
});
