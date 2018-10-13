const injectedScript = document.createElement("script");
injectedScript.src = chrome.extension.getURL("injected_script.js");
injectedScript.type = "text/javascript";
document.head.appendChild(injectedScript);
