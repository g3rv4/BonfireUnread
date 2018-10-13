// the favicon is hosted on a different domain, so the image composition
// fails (because it's a "tainted" image). With this trick, I'm adding
// the CORS header for the favicon

chrome.webRequest.onHeadersReceived.addListener(
    details => {
        if (details.method === "GET") {
            details.responseHeaders.push({
                "name": "Access-Control-Allow-Origin",
                "value": "*"
            });
        }
        return {
            responseHeaders: details.responseHeaders
        };
    },
    { urls: ["https://cdn.sstatic.net/Sites/*/favicon.ico*"] },
    ['blocking', 'responseHeaders']);
