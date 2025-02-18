const MATCH_VIEWER_URLS = {
  prod: "https://immament.github.io/football-match-viewer/?ext=1",
  dev: "http://localhost:5173/?ext=1",
};

const MATCH_VIEWER_URL = MATCH_VIEWER_URLS.prod;
const MATCH_RELATION_URL = "footstar.org/match/relatorio.asp";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === "matchData") {
    sendResponse("ok");

    const viewerTab = await chrome.tabs.create({ url: MATCH_VIEWER_URL });

    setTimeout(() => {
      sendMatchData(viewerTab, {
        matchId: message.matchId,
        matchXml: message.matchXml,
      });
    }, 500);
  }
});

async function sendMatchData(viewerTab, matchData, retryCount = 0) {
  let success = false;
  try {
    const response = await chrome.tabs.sendMessage(viewerTab["id"], {
      message: "matchData",
      data: matchData,
      retryCount,
    });
    console.log("sendMatchData response", response);
    success = response.result === "success";
  } catch (err) {
    console.warn("send message to viewer problem", viewerTab["id"], err);
  }

  if (!success & (retryCount < 4)) {
    setTimeout(() => {
      sendMatchData(viewerTab, matchData, retryCount + 1);
    }, 500);
  }
}
