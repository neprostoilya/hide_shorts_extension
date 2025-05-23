document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById("toggleBtn");

    chrome.storage.sync.get(['shortsHidden'], function(result) {
        const isEnabled = result.shortsHidden || false;
        toggleBtn.checked = isEnabled;
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab && tab.url.includes("https://www.youtube.com/")) {
                chrome.tabs.sendMessage(tab.id, { toggle: isEnabled });
            }
        });
    });

    toggleBtn.addEventListener("change", (event) => {
        const isEnabled = event.target.checked;
        
        chrome.storage.sync.set({ shortsHidden: isEnabled }, () => {
            console.log(`Состояние сохранено: ${isEnabled ? 'включено' : 'выключено'}`);
        });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab && tab.url.includes("https://www.youtube.com/")) {
                chrome.tabs.sendMessage(tab.id, { toggle: isEnabled });
            }
        });
    });
}); 