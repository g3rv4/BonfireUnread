const favicon = $('link[rel="shortcut icon"]')[0];
favicon.rel = "";

const customFavicon = document.createElement("link");
customFavicon.rel = "shortcut icon";
customFavicon.type = "image/png";

// I'm adding the CORS header for things in the CDN, but bonfire doesn't always use it.
// fix the favicon url so that we know what we should use
let defaultFaviconHref = favicon.href;

// some sites use a relative protocol... normalize that
defaultFaviconHref = defaultFaviconHref.replace(/^https?:/, '');

// now force the cdn
defaultFaviconHref = defaultFaviconHref.replace(/^\/\/[^\/]*\/(content\/)?/, '//cdn.sstatic.net/');

// aaand use https... because we're good people
defaultFaviconHref = 'https:' + defaultFaviconHref;

customFavicon.href = defaultFaviconHref;
document.head.appendChild(customFavicon);
window.customFavicon = customFavicon;

const contentObserver = new MutationObserver(async (records, _) => {
    const newTitle = $('title')[0].innerText;

    const match = /^\(([0-9]+)?(\*?)\)/.exec(newTitle);
    let count = 0;
    let ping = '';
    if (match) {
        count = parseInt(match[1]);
        ping = match[2];
    }

    if (!count && !ping) {
        window.customFavicon.href = defaultFaviconHref;
        return;
    }

    const faviconSize = 16;
    const canvas = document.createElement("canvas");
    canvas.width = faviconSize;
    canvas.height = faviconSize;

    const context = canvas.getContext("2d");
    const img = document.createElement("img");
    img.crossOrigin = 'anonymous';
    img.src = defaultFaviconHref;

    img.onload = () => {
        // Draw Original Favicon as Background
        context.drawImage(img, 0, 0, faviconSize, faviconSize);

        // Draw Notification Number
        context.fillStyle = "black";
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.font = "10px Tahoma";
        context.textAlign = "right";
        context.textBaseline = "bottom";

        let num = count ? count : ""; //avoid NaN

        context.strokeText(num + ping, canvas.width - 2, canvas.height);
        context.fillText(num + ping, canvas.width - 2, canvas.height);

        // Replace favicon
        window.customFavicon.href = canvas.toDataURL("image/png");
    };
});

const title = $('title')[0];
contentObserver.observe(title, { childList: true, attributes: true, subtree: true });
