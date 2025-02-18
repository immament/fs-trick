"use strict";

apply();

function apply() {
  const containerElement = document.querySelector(".result-col");

  if (!containerElement) {
    setTimeout(() => apply(), 500);
    return;
  }
  if (!document.querySelector("#header-main > .navbar-top")) {
    console.log("Warn: Not logged in");
    return;
  }
  // main component
  const component = document.createElement("div");
  component.className = "mt-1";

  // link
  const link = document.createElement("a");
  link.innerHTML = "<i class='fa-solid fa-flask'></i> 3D Beta";
  link.target = "_blank";
  link.rel = "noopener";
  link.className = "small text-secondary pointer";
  link.onclick = async () => {
    link.style.visibility = "hidden";
    await openFootballViewer();
    setTimeout(() => {
      link.style.visibility = "visible";
    }, 2000);
  };

  component.appendChild(link);

  containerElement.appendChild(component);
}

async function openFootballViewer() {
  const { matchId, fsDomain } = getMatchIdFromUrl();
  if (!matchId) {
    throw Error("match id not ound in url");
  }
  const matchXml = await loadMatchData(fsDomain, matchId);

  if (!matchXml) {
    console.warn("no match data");
    return;
  }

  const response = await chrome.runtime.sendMessage({
    type: "matchData",
    matchId,
    matchXml,
  });
  console.log("content - message response", response);
}

function getMatchIdFromUrl() {
  const [baseUrl, params] = location.href.split("?");
  const urlParams = new URLSearchParams(params);
  const fsDomain = getFsDomain(baseUrl);
  console.log(
    "matchId:",
    urlParams.get("jogo_id")?.replaceAll("#", ""),
    fsDomain
  );

  return {
    matchId: Number(urlParams.get("jogo_id")?.replaceAll("#", "")),
    fsDomain,
  };
}

function getFsDomain(baseUrl) {
  return (baseUrl.includes("www") ? "www." : "") + "footstar.org";
}

async function loadMatchData(fsDomain, matchId) {
  if (!matchId) return;

  const matchXml = await fetch(
    `https://${fsDomain}/match/get_data_nviewer.asp?jogo_id=${matchId}`
  ).then((response) => response.text());
  return matchXml;
}
