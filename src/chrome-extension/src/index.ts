console.log("HTTP PROXY EXTENSION INITIALIZED");

import MAIN_SERVER_URL from "../../shared-network/constants/to-main/MAIN_SERVER_URL";
import { url } from "inspector";
//setInterval(async () => await Axios.get("http://localhost/heartbeat"), 1000);

/**
 * Left side is the proxy URL, the right side is the steam target url
 */
const proxyURLToSteamURLMap: Record<string, string> = {};

const HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options"];

// iframe remove blocking
chrome.webRequest.onHeadersReceived.addListener(
  (details) => ({
    responseHeaders: details.responseHeaders.filter((header) => !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase())),
  }),
  {
    urls: ["<all_urls>"],
  },
  ["blocking", "responseHeaders"]
);
function getProxyUrl(urlString: string) {
  const url = new URL(urlString);

  if (urlString.includes("localhost")) {
    return "https://steamcommunity.com" + url.pathname + url.search;
  } else {
    return urlString;
  }
}
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    console.log("adding header", details.url, getProxyUrl(proxyURLToSteamURLMap[details.url]));
    details.requestHeaders.push(
      { name: "client-id", value: "76561198203198914" },
      { name: "proxy-url", value: getProxyUrl(proxyURLToSteamURLMap[details.url]) }
    );
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const newUrl = (() => {
      if (details.url.includes("localhost")) {
        const steamURL = "https://steamcommunity.com" + url.pathname + url.search;
        proxyURLToSteamURLMap[details.url] = steamURL;
        console.log("steam url", steamURL, "proxy url", details.url);
        return details.url;
      } else {
        const proxyURL = "http://localhost" + url.pathname + url.search;
        proxyURLToSteamURLMap[proxyURL] = details.url;

        return proxyURL;
      }
    })();
    proxyURLToSteamURLMap[newUrl] = details.url;
    console.log("redirecting to", newUrl);
    return {
      redirectUrl: newUrl,
    };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// chrome.webNavigation.onBeforeNavigate.addListener((request) => {
//   const url = new URL(request.url);
//   const newUrl = "http://localhost" + url.pathname + url.search;
//   return {
//     redirectUrl: newUrl,
//   };
// });
