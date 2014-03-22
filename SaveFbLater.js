var urlCheck;
var SaveFbLater = {
    myStorage: null,
    initComplete: null,

    init: function(mode) {
      var self = this;
      chrome.storage.local.get('fbSaveLater', function(o) {
        if (chrome.runtime.lastError) {
               console.log("ERROR: " + chrome.runtime.lastError.message);
        }
        self.myStorage = o.fbSaveLater||{links:[],desc:{text: {}, src: {}}};
        if (self.myStorage) self.initComplete = true;
        else self.initComplete = false;

        if (typeof mode == 'undefined' || mode != 'feed') self.getSavedList();
        else if (mode == 'feed') {
          self.showFeed();
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
          var listEle = document.createElement('li');
          listEle.className = "list-item";
          listEle.innerHTML = '<a href="'+item+'" target="_blank">['+descTable.src[item]+']</a>&nbsp;'+descTable.text[item];
          var removeItemBtn = document.createElement('a');
          removeItemBtn.href = "";
          removeItemBtn.setAttribute("data-href",item);
          removeItemBtn.className = "button-lnk removeLnk";
          removeItemBtn.innerHTML = "x";
          removeItemBtn.addEventListener('click',function(o, e) {
            SaveFbLater.remove(this.getAttribute("data-href"));
          });
          listEle.appendChild(removeItemBtn);
          ulEle.appendChild(listEle);
        }
      };
    },

    showFeed: function() {
      var savedList = this.myStorage.links;

      var i = 0;
      var len = savedList.length;
      var ulEle = document.getElementById('savedList');
      ulEle.innerHTML = '';
      for (var i = 0; i < len; ++i) {
        var item = savedList[i];
        if (item != null && item != '') {
          var listEle = document.createElement('div');
          listEle.className = "pure-u-1-3 fb-post";
          listEle.setAttribute("data-href",item);
          listEle.setAttribute("data-width",420);
          //listEle.appendChild(removeItemBtn);
          ulEle.appendChild(listEle);
        }
      };
    },

    clear: function() {
      chrome.storage.local.clear();
      this.init();
      document.getElementById('savedList').innerHTML = '';
    },

    remove: function(itemToDel) {
      var index = this.getItemIndex(itemToDel);
      if (index > -1) {
        this.myStorage.links.splice(index,1);
        this.updateStorage(this.myStorage);
        return true;
      } else return false;
    },

    getItemIndex: function(item) {
      return this.myStorage.links.indexOf(item);
    },

    populateNewTab: function(mode) {
      if (typeof mode == 'undefined' || (mode != 'feed' && mode != 'list')) mode = 'feed';
      chrome.tabs.create({url:chrome.extension.getURL(mode+".html"),active:true});
    }
  };