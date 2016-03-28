/*!
  FbSave4Later::List.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
  @author Kami
  @since 2014.03.24.17:28
  @version 1.0.6.3
*/
document.addEventListener('DOMContentLoaded', function(){
  SaveFbLater.init('import');
  document.getElementById('clearCache').addEventListener('click',function(o, e) {
    if (confirm('Are you sure?')) SaveFbLater.clear();
  });
  document.getElementById('getFeeds').addEventListener('click',function(o, e) {
    SaveFbLater.redirect();
  });
  document.getElementById('getList').addEventListener('click',function(o, e) {
    SaveFbLater.redirect('list');
  });
  document.getElementById('export').addEventListener('click',function(o, e) {
    SaveFbLater.toJson();
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
  
  document.getElementById('importfile').addEventListener('change',function(e) {
    var importFiles = e.target.files;
    if (importFiles.length !== 1 || !importFiles[0].name.endsWith('.json')) {
        document.getElementById('btn-import').setAttribute('disabled','disabled');
        return;
    }
    document.getElementById('btn-import').removeAttribute('disabled');
  });
  document.getElementById('btn-import').addEventListener('click',function(o, e) {
    try {
        var importFiles = document.getElementById('importfile').files;
        if (importFiles.length !== 1) return;
        
        var r = new FileReader();
        r.onload = function(e) {
          var json = e.target.result;
          var yourJson = JSON.parse(json);
          
          var confirmClear = confirm("Import will OVERWRITE your current data (you should export current data in case of problems). Are you sure to continue?");
          if (!confirmClear) return;
          
          SaveFbLater.importJson(yourJson);
        }
        
        r.readAsText(importFiles[0]);
    } catch (err) {
        alert('Import failed: Corrupted or invalid data!');
    }
  });
});