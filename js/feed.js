/*!
  FbSave4Later::Feed.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
*/
document.addEventListener('DOMContentLoaded', function(){
  // var hash = window.location.hash.substr(1);
  // if (hash !== "week" && hash !== "month") {
  //   SaveFbLater.init('feed');
  // } else SaveFbLater.init('feed',hash);
  SaveFbLater.init('feed');
  document.getElementById('clearCache').addEventListener('click',function(o, e) {
    if (confirm('Are you sure?')) SaveFbLater.clear();
  });
  document.getElementById('getList').addEventListener('click',function(o, e) {
    SaveFbLater.populateNewTab('list');
  });
});