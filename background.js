chrome.contextMenus.create({"title": "List view", "onclick" : function() {
		chrome.tabs.create({url:chrome.extension.getURL("list.html"),active:true});
	}}, function() {
	  if (chrome.extension.lastError) {
		console.log("Background: " + chrome.extension.lastError.message);
	  }
});
chrome.contextMenus.create({"title": "Feeds view", "onclick" : function() {
		chrome.tabs.create({url:chrome.extension.getURL("feed.html"),active:true});
	}}, function() {
	  if (chrome.extension.lastError) {
		console.log("Background: " + chrome.extension.lastError.message);
	  }
});

chrome.tabs.onUpdated.addListener(function(tabId , info) {
    chrome.tabs.get(tabId, function(tab) {
        if (tab.url && tab.url.match('http.\:\/\/[\w]+\.facebook\.com')) {
          if (info.status == "complete") {
              chrome.tabs.insertCSS(tab.id, {file: "inject.css"}, function() {
                if (chrome.runtime.lastError) {
                    console.log("ERROR InsertCSS: " + chrome.runtime.lastError.message);
                }
              });
              chrome.tabs.executeScript(tab.id, {file: "inject.js"}, function() {
                if (chrome.runtime.lastError) {
                    console.log("ERROR insertJS: " + chrome.runtime.lastError.message);
                }
              });
          }
        }
    });
});