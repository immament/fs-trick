"use strict";

console.log("viewer content");

let matchViewerReady = false;

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.message === "matchData") {
    console.log("content: received matchData");

    sendResponse({ result: "success" });

    const event = new CustomEvent("matchDataForViewer", {
      detail: message.data,
    });
    sendToMatchViewer(event);
  }
});

function sendToMatchViewer(event, retryCount = 0) {
  if (matchViewerReady) {
    document.dispatchEvent(event);
    return;
  }
  if (retryCount >= 5) return;
  setTimeout(() => sendToMatchViewer(event, retryCount + 1), 500);
}

document.addEventListener("matchViewerReady", () => {
  console.log("matchViewerReady");
  matchViewerReady = true;
});
