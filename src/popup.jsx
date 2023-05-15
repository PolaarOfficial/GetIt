import React from 'react'
import {createRoot} from 'react-dom/client'
const target = document.getElementById('react-target')


async function getCurrentTab(){
    const queryOptions = {active:true, currentWindow:true}
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

target.addEventListener('click', async () =>{
    const tab = await getCurrentTab();

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['contentScript.js'],
        injectImmediately: true
    });
});

function Popup() {

    return (
        <div>
            <h1>Hello Billy Bob</h1>
            <MyButton />
        </div>
    );
}
const root = createRoot(target)
root.render(<Popup/>);
function MyButton(){
    const handleClick = () =>{
        console.log('button clicked');
        getCurrentTab().then(tab =>{
            console.log('tab info', tab.id)
            chrome.tabs.sendMessage(
                tab.id,
                {message: "it is the popup"},
                function(response){
                    console.log(response.status);
            });
        })
    }

    return (
        <button onClick={handleClick}>
            Click Me
        </button>
    );
}
