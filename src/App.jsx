/* global chrome */

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const target = document.getElementById("root");
  async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  target.addEventListener("click", async () => {
    const tab = await getCurrentTab();

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
      injectImmediately: true,
    });
  });
  const handleClick = () => {
    console.log("button clicked");
    getCurrentTab().then((tab) => {
      console.log("tab info", tab.id);
      chrome.tabs.sendMessage(
        tab.id,
        { message: "it is the popup" },
        function (response) {
          console.log("hello from popup: " + response.status);
        }
      );
    });
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handleClick}>click me</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
