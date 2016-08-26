/*!
  FbSave4Later::List.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
  @author Kami
  @since 2014.03.24.17:28
  @version 1.0.6.2
*/
document.addEventListener('DOMContentLoaded', function(){
  SaveFbLater.init();
  document.getElementById('clearCache').addEventListener('click',function(o, e) {
    if (confirm('Are you sure?')) SaveFbLater.clear();
  });
  document.getElementById('getFeeds').addEventListener('click',function(o, e) {
    SaveFbLater.populateNewTab();
  });
  document.getElementById('export').addEventListener('click',function(o, e) {
    SaveFbLater.toJson();
  });
  document.getElementById('import').addEventListener('click',function(o, e) {
    SaveFbLater.populateNewTab('import');
  });
  document.getElementById('search').addEventListener('keyup', function(e) {
    var val = '^(?=.*\\b' + (this.value).trim().split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        text;

    var list = document.getElementsByClassName('list-item');
    Array.prototype.forEach.call(list, function(el, i){ el.style.display = '';});

    Array.prototype.filter.call(list, function(el, i) {
        text = '';
        text = el.querySelector('div').textContent.trim().replace(/([\n\r\t\f\u2028\u2029\x0A\x0D]|%0A|%0D)+/,'').replace(String.fromCharCode(10),'');
    //text = text.replace(String.fromCharCode(10),'');
    text = encodeURIComponent(text);
    text = decodeURIComponent(text.replace(/\%0A|\%0D/,'%20'));
        if (!reg.test(text)) el.style.display = 'none';
    });
  });
});