/**
 * @author Kami
 * @since 2014.03.24.17:30
 * @version 1.0.6.2
 */
var urlCheck;
var SaveFbLater = {
    myStorage: null,
    initComplete: null,

    init: function(mode, hash) {
      var self = this;
      chrome.storage.local.get('fbSaveLater', function(o) {
        if (chrome.runtime.lastError) {
               console.log("ERROR: " + chrome.runtime.lastError.message);
        }
        self.myStorage = o.fbSaveLater||{links:[],desc:{text: {}, src: {}, preview: {}, isPublic: {}, savedtime: {}}};
        if (self.myStorage) self.initComplete = true;
        else self.initComplete = false;

        //self.toJson();
        if (typeof mode == 'undefined' || (mode != 'feed' && mode != 'import')) self.getSavedList();
        else if (mode == 'feed') {
          self.showFeed(hash);
        }
      });
    },
    
    sync: function(){
      chrome.storage.sync.set({
            'fbSaveLater': this.myStorage
        }, function (o) {
            if (chrome.runtime.lastError) {
                console.log("ERROR-SYNC: " + chrome.runtime.lastError.message);
                alert('Sync failed: Too many data!');
            }
        });
    },

    updateStorage: function(newStorage) {
      if (typeof newStorage != 'undefined') this.myStorage = newStorage;
      chrome.storage.local.set({
            'fbSaveLater': this.myStorage
        }, function (o) {
            if (chrome.runtime.lastError) {
                console.log("ERROR: " + chrome.runtime.lastError.message);
            }
        });
    },

    getSavedList: function() {
      var savedList = this.myStorage.links;
      var descTable = this.myStorage.desc;

      var i = 0;
      var len = savedList.length;
      var ulEle = document.getElementById('savedList');

      // Reset list
      while (ulEle.firstChild) {
        ulEle.removeChild(ulEle.firstChild);
      }

      for (var i = 0; i < len; ++i) {
        var item = savedList[i];
        if (item != null && item != '') {
          var listEle = document.createElement('div');
          listEle.className = "list-item post pure-u-1-1";
          try {
            var descText = decodeURIComponent(descTable.text[item]);
          } catch (err) { var descText = descTable.text[item];}
          //var descUser = descTable.src[item].replace(/([a-z])([^\sa-zA-Z0-9]{1})([A-Z])/,'$1 > $3');
          var descUser = descTable.src[item].replace(/([\w\W])([^a-zA-Z0-9\s\b]{1})([A-Z])/,'$1 > $3');
          var timestamp = '', hideTimestamp = '';
          if (typeof descTable.savedtime != 'undefined' && typeof descTable.savedtime[item] != 'undefined') {
            var x = new Date(parseInt(descTable.savedtime[item]));
            timestamp = 'saved on '+x.getFullYear()  + '/' + (x.getMonth()+1) + '/' +  x.getDate() + ' ' + x.getHours() + ":" + x.getMinutes();
          }
          if (timestamp === '') hideTimestamp = 'style="display:none;"';
          listEle.innerHTML = '<span class="removeLnk">|</span><a target="_blank" href="https://getpocket.com/save?url='+encodeURIComponent(item)+'" class="pocket-btn removeLnk">Send to Pocket</a>\
          <div><div class="meta-author">\
          <h2 class="post-title"><a class="meta-username" href="'+item+'" target="_blank">'+descUser+'</a></h2>\
          <a href="'+item+'" target="_blank" class="timestamp" '+hideTimestamp+'>'+timestamp+'</a></div>\
          <div class="desc-text-wrapper message">'+descText+'</div></div>';
          // var descTextEle = document.createElement('div');
          // descTextEle.className = "desc-text-wrapper";
          // descTextEle.innerHTML = descText;
          // listEle.appendChild(descTextEle);
          // ulEle.appendChild(listEle);
          ulEle.insertBefore(listEle, ulEle.firstChild);
          var removeItemBtn = document.createElement('a');
          removeItemBtn.href = "javascript:;";
          removeItemBtn.setAttribute("data-href",item);
          removeItemBtn.className = "button-lnk removeLnk";
          removeItemBtn.innerHTML = "x";
          removeItemBtn.addEventListener('click',function(o, e) {
            SaveFbLater.remove(this.getAttribute("data-href"));
            document.getElementById('savedList').removeChild(this.parentNode);
          });
          listEle.insertBefore(removeItemBtn, listEle.firstChild);
        }
      };
      var showmoreLinks = document.querySelectorAll('.text_exposed_link a');
      if (showmoreLinks && showmoreLinks.length > 0) {
        Array.prototype.forEach.call(showmoreLinks, function(el, i){
          var parentDivId = el.getAttribute('onclick').match(/id_[a-zA-Z0-9]+/)[0];
          el.setAttribute('data-parentId',parentDivId);
          el.removeAttribute('href');//href="javascript:;";
          el.removeAttribute('onclick');
          el.addEventListener('click',function(o,e) {
            //document.getElementById(this.getAttribute('data-parentId'))
            var parentDivId = this.getAttribute('data-parentId');
            document.getElementById('dynamic-style').innerHTML += '#'+parentDivId+' .text_exposed_hide{display: none !important}#'+parentDivId+' .text_exposed_show{display: inline !important}';
            // var showLink = this.parentNode.parentNode;
            // showLink.style.display = 'none';
            // showLink.previousSibling.style.display = 'inline';
            // var threeDots = showLink.previousSibling.previousSibling;
            // if (threeDots.className == '').style.display = 'none';
          });
        });
      }
      chrome.browserAction.setBadgeBackgroundColor({ color: "#3af" });
      chrome.browserAction.setBadgeText({text:''+len});
    },

    showFeed: function(timeHash) {
      var savedList = this.myStorage.links;

      var i = 0;
      var len = savedList.length;
      var ulEle = document.getElementById('savedList');
      ulEle.innerHTML = '';

        var descTable = this.myStorage.desc;
        var now = new Date();
        for (var i = 0; i < len; ++i) {
          var item = savedList[i];
          // if ( typeof timeHash != 'undefined'
          //   && (timeHash === "week" || timeHash === "month")) {
          //     if ( typeof descTable.savedtime != 'undefined'
          //     && typeof descTable.savedtime[item] != 'undefined') {
          //       var x = new Date(parseInt(descTable.savedtime[item]));
          //       switch(timeHash) {
          //         case "week":
          //           if (x < (now - 86400*1000*10)) continue;
          //           break;
          //         case "month":
          //           if (x < (now - 86400*1000*30)) continue;
          //           break;
          //       }
          //     } else continue;
          // }
          if (item != null && item != '') {
            var listEle = document.createElement('div');
            if (  typeof descTable.isPublic != 'undefined'
                  && typeof descTable.isPublic[item] != 'undefined'
                  && (descTable.isPublic[item]) != 1
                  && typeof descTable.preview[item] != 'undefined') {
              // if (parseInt(descTable.public[item]) < 0) {
              //   listEle.className = "_4q_ _6kq _2iwo _5usc fb-post";
              //   listEle.innerHTML = '<div class="warning-header _5pco">Warning! This post is from a Facebook Group and cannot be seen outside of Facebook.</div>\
              //   <div class="_2iwq"><div class="_2iwr"></div><div class="_2iws"></div><div class="_2iwt"></div>\
              //   <div class="_2iwu"></div><div class="_2iwv"></div><div class="_2iww"></div>\
              //   <div class="_2iwx"></div><div class="_2iwy"></div><div class="_2iwz"></div>\
              //   <div class="_2iw-"></div><div class="_2iw_"></div><div class="_2ix0"></div></div>';
              // } else {
                try {
                  var previewHtml = decodeURIComponent(descTable.preview[item]);
                } catch (err) { var previewHtml = descTable.preview[item];}

                listEle.className = "_6ns _5jmm fb-post pure-u-1-2";
                //var descUser = descTable.src[item].replace(/([a-z])([^\sa-zA-Z0-9]{1})([A-Z])/,'$1 > $3');
                var descUser = descTable.src[item].replace(/([\w\W])([^a-zA-Z0-9\s\b]{1})([A-Z])/,'$1 > $3');
                listEle.innerHTML = '<div class="_4q_ _6kq">\
                <div class="warning-header _5pco">Warning! This post is not public and cannot be seen outside of Facebook. The below content is a cached version.</div>\
                <h2 class="_6nl mrm"><span class="fwb"><a href="'+item+'" target="_blank">'+descUser+'</a></span></h2>\
                <div class="desc-text-wrapper _6nm">'+decodeURIComponent(descTable.text[item])+'</div><div class="_6kv">'+previewHtml+'</div></div>';
              // }
            } else {
              listEle.className = "fb-post";
              listEle.setAttribute("data-href",item);
              listEle.setAttribute("data-width",420);
            }
            ulEle.appendChild(listEle);
          }
        };
        chrome.browserAction.setBadgeBackgroundColor({ color: "#3af" });
        chrome.browserAction.setBadgeText({text:''+len});
    },

    clear: function(mode) {
      chrome.storage.local.clear();
      this.init(mode);
      chrome.browserAction.setBadgeText({text:'0'});
      var savedListDom = document.getElementById('savedList');
      if (savedListDom && savedListDom.length) savedListDom.innerHTML = '';
    },

    remove: function(itemToDel) {
      var index = this.getItemIndex(itemToDel);
      if (index > -1) {
        this.myStorage.links.splice(index,1);
        this.updateStorage(this.myStorage);
        chrome.browserAction.setBadgeBackgroundColor({ color: "#3af" });
        chrome.browserAction.setBadgeText({text:''+this.myStorage.links.length});
        return true;
      } else return false;
    },

    getItemIndex: function(item) {
      return this.myStorage.links.indexOf(item);
    },

    populateNewTab: function(mode) {
      if (typeof mode == 'undefined' || (mode != 'feed' && mode != 'list' && mode != 'import')) mode = 'feed';
      chrome.tabs.create({url:chrome.extension.getURL(mode+".html"),active:true});
    },
    
    redirect: function(mode) {
      if (typeof mode == 'undefined' || (mode != 'feed' && mode != 'list' && mode != 'import')) mode = 'feed';
      chrome.tabs.update({url:chrome.extension.getURL(mode+".html"),active:true});
    },

    toJson: function() {
      var exportLnk = document.getElementById('export');
      exportLnk.href= 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.myStorage));
      //return JSON.stringify(this.myStorage);
    },
    
    importJson: function(data){
      this.clear('import');
      this.updateStorage(data);
      this.redirect('list');
    }
  };