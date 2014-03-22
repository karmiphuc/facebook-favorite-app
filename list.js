/*!
  FbSave4Later::List.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
*/
document.addEventListener('DOMContentLoaded', function(){
  SaveFbLater.init();
  document.getElementById('clearCache').addEventListener('click',function(o, e) {
    if (confirm('Are you sure?')) SaveFbLater.clear();
  });
  document.getElementById('getFeeds').addEventListener('click',function(o, e) {
    SaveFbLater.populateNewTab();
  });
  document.getElementById('search').addEventListener('keyup', function(e) {
    var val = '^(?=.*\\b' + (this.value).trim().split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;

    var list = document.getElementsByTagName('li');
    Array.prototype.forEach.call(list, function(el, i){ el.style.display = '';});

    Array.prototype.filter.call(list, function(el, i) {
        text = el.innerText.trim();
        if (!reg.test(text)) el.style.display = 'none';
    });
  });
});