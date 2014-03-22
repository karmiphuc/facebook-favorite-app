/*!
  FbSave4Later::Popup.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
*/
document.addEventListener('DOMContentLoaded', function(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    urlCheck = tabs[0].url.match('http.\:\/\/[\w]+\.facebook\.com');
    if (urlCheck == null || urlCheck[0]!=="https://www.facebook.com") {
      urlCheck = tabs[0].url == chrome.extension.getURL("feed.html");
    } else urlCheck = true;
    //if (urlCheck != null && urlCheck[0]==="https://www.facebook.com") {
    if (urlCheck) {
        SaveFbLater.init();
        document.getElementById('clearCache').addEventListener('click',function(o, e) {
		  if (confirm('Are you sure?')) SaveFbLater.clear();
        });
        document.getElementById('getList').addEventListener('click',function(o, e) {
          SaveFbLater.populateNewTab('list');
        });
        document.getElementById('getFeeds').addEventListener('click',function(o, e) {
          SaveFbLater.populateNewTab();
        });
        chrome.tabs.executeScript(null, {file: "inject.js"}, function() {
          if (chrome.runtime.lastError) {
              console.log("ERROR: " + chrome.runtime.lastError.message);
          }
        });
    } else {
      document.write('Sorry! This extension only runs on Facebook.');
    }
  });
});