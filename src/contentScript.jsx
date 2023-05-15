//     console.log("content-scripts")
//     const response = await chrome.runtime.sendMessage({greeting:'hello'})
//     console.log(response)
// })
console.log('contentScript loaded')
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    console.log(request.message);
    sendResponse({status:'done'});
    }
);
