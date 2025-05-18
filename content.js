let shortsHidden = false;

(function addHiddenStyle() {
    if (!document.getElementById("hidden-shorts-style")) {
        const style = document.createElement("style");
        style.id = "hidden-shorts-style";
        style.textContent = `
            .hidden-shorts { 
                display: none !important; 
            }
            /* Деактивация элемента навигации Shorts */
            .disabled-shorts-guide {
                pointer-events: none !important;
                opacity: 0.6;
            }
            .disabled-shorts-guide yt-icon.guide-icon,
            .disabled-shorts-guide yt-formatted-string.title {
                color: #717171 !important;
            }
        `;
        document.head.appendChild(style);
    }
})();

function updateShortsVisibility() {
    const sections = document.querySelectorAll("ytd-rich-section-renderer");
    sections.forEach(section => {
        const titleEl = section.querySelector("#title");
        if (titleEl && titleEl.textContent.trim() === "Shorts") {
            if (shortsHidden) {
                section.classList.add("hidden-shorts");
            } else {
                section.classList.remove("hidden-shorts");
            }
        }
    });
}

function updateGuideShortsVisibility() {
    const entries = document.querySelectorAll("ytd-guide-entry-renderer");
    entries.forEach(entry => {
        const titleEl = entry.querySelector("yt-formatted-string.title");
        if (titleEl && titleEl.textContent.trim() === "Shorts") {
            if (shortsHidden) {
                entry.classList.add("disabled-shorts-guide");
                const endpointLink = entry.querySelector("a#endpoint");
                if (endpointLink) {
                    endpointLink.style.pointerEvents = "none";
                }
            } else {
                entry.classList.remove("disabled-shorts-guide");
                const endpointLink = entry.querySelector("a#endpoint");
                if (endpointLink) {
                    endpointLink.style.pointerEvents = "";
                }
            }
        }
    });
}

function updateReelShortsVisibility() {
    const reels = document.querySelectorAll("ytd-reel-shelf-renderer");
    reels.forEach(reel => {
        const titleEl = reel.querySelector("#title");
        if (titleEl && titleEl.textContent.trim() === "Shorts") {
            if (shortsHidden) {
                reel.classList.add("hidden-shorts");
            } else {
                reel.classList.remove("hidden-shorts");
            }
        }
    });
}

function toggleShortsVisibility(isHidden) {
    shortsHidden = isHidden;
    updateShortsVisibility();
    updateGuideShortsVisibility();
    updateReelShortsVisibility();
}

chrome.storage.sync.get(['shortsHidden'], function(result) {
    if (result.shortsHidden !== undefined) {
        toggleShortsVisibility(result.shortsHidden);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (typeof request.toggle !== "undefined") {
        toggleShortsVisibility(request.toggle);
    }
});

const observer = new MutationObserver((mutations) => {
    if (!shortsHidden) return;
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            updateShortsVisibility();
            updateGuideShortsVisibility();
            updateReelShortsVisibility();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true }); 