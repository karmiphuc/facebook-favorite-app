/*!
  FbSave4Later::Inject.js v1.0.2
  Copyright 2014 Karmi Phuc. All rights reserved.
  Licensed under the LGPL License.
  http://www.gnu.org/copyleft/lesser.html
*/
function injectLinks() {
    //if (document.getElementsByClassName('fb-save-4-later').length >= 0) {
        var mode = "news", designMode = "old";
        var data = document.getElementsByClassName('_5pax');
        //var data = document.getElementsByClassName('_5pcp');
        var len = data.length;
        if (len === 0) {
			//designMode = "old";
			mode = "profile";
			data = document.querySelectorAll('[id^=tl_unit_]');
			len = data.length;
			
			if (len === 0) {
				designMode = "new";
				data = document.querySelectorAll('.timelineUnitContainer[id^=u_jsonp_]');
				len = data.length;
				
				if (len === 0) {
					mode = "news";
					designMode = "new";
					data = document.querySelectorAll('._6kq');
					len = data.length;
					if (len === 0) {
						data = document.querySelectorAll('.userContentWrapper');
						len = data.length;
						// if (len === 0) {			
							// designMode = "old";
							// mode = "profile";
							// data = document.querySelectorAll('[id^=tl_unit_]');
							// len = data.length;
						// }
					}
				}
			}
		
        }

        if (typeof storage == 'undefined') var storage = null;
        chrome.storage.local.get('fbSaveLater', function (o) {
            storage = o.fbSaveLater;
            populateLinks(data, len, storage, mode==="news", designMode!=="old");
        });

        function populateLinks(data, len, storage, isNewsFeed, isNewDesign) {
            var i = 0;
            for (; i < len; ++i) {
                var d = data[i];
                var injectionWrapper, href;
                if (isNewsFeed) {
                    if (isNewDesign) {
                        injectionWrapper = d.querySelector('._6mc');
                        if (!injectionWrapper) {
							injectionWrapper = d.querySelector('.fcg a._5pcq');
							if (!injectionWrapper) continue;
							if (typeof injectionWrapper.length == 'undefined') injectionWrapper = [injectionWrapper];
							href = injectionWrapper;
							injectionWrapper = d.querySelector('._5vsi');
						} else {
							href = injectionWrapper.querySelectorAll('._cv7 a');
							injectionWrapper = d.querySelector('._5ciy');
						}
                    } else {
                        injectionWrapper = d.querySelector('._5pcp');
                        if (!injectionWrapper) continue;
                        href = injectionWrapper.querySelectorAll('span ._5pcq');
                    }
                }
                else {
                    injectionWrapper = d.querySelector('._3dp._29k');
                    if (!injectionWrapper) continue;
                    href = injectionWrapper.querySelectorAll('._1_n.fcg a.uiLinkSubtle');
                }
                if (typeof href[0] == 'undefined' || !href[0]) continue;

                // Check if already injected
                var isSaved = storage && typeof storage != 'undefined' && typeof storage['links'] != 'undefined' && storage['links'].length && storage['links'].indexOf(href[0].href) > -1;
                // if (isNewsFeed) {
                //     var injectedEle = injectionWrapper.getElementsByClassName('fb-save-4-later');
                // } else {
                //     var injectedEle = d.getElementsByClassName('fb-save-4-later');
                // }
                var injectedEle = d.getElementsByClassName('fb-save-4-later');
                if (!isSaved && injectedEle.length) {
                    injectedEle[0].className = 'fb-save-4-later';
                    injectedEle[0].innerHTML = 'Favorite';
                } else if (typeof href[0] != 'undefined' && !injectedEle.length) {
                    var ahref = document.createElement('a');
                    ahref.href = '#';
                    if (isSaved) {
                        ahref.innerHTML = 'Saved';
                        ahref.className = 'fb-save-4-later _5cix saved';
                    } else {
                        ahref.className = 'fb-save-4-later _5cix';
                        ahref.innerHTML = 'Favorite';
                        ahref.setAttribute('data-link', href[0].href);

                        var descUser;
                        if (isNewsFeed) {
                            if (isNewDesign) {
                                descUser = d.querySelector('._6nl:not(._6td) a');
								if (descUser) descUser = descUser.textContent;
                                else descUser = d.querySelector('._5pbw .fwn.fcg span').textContent;
                            } else descUser = d.querySelector('a').innerHTML;
                        }
                        else descUser = d.querySelector('.fcg a').innerHTML;
                        ahref.setAttribute('data-user', descUser);

                        var descText;
                        if (isNewsFeed) {
                            if (isNewDesign) {
                                descText = d.querySelector('.userContentWrapper .userContent');
                                if (typeof descText == 'undefined' || !descText) {
                                    descText = d.querySelector('._6nl:not(._6td)').textContent.trim();
                                } else descText = descText.textContent.trim();
                            } else {
                                descText = d.querySelector('.userContentWrapper ._5pbx.userContent');
                                if (typeof descText == 'undefined' || !descText) {
                                    descText = d.querySelector('._5pbw');
                                    if (typeof descText != 'undefined' && descText) descText = descText.textContent.substr(0,1000);
                                    else descText = "";
                                } else {
                                    descText = descText.innerText.substr(0,1000);
                                }
                            }
                        } else {
                            descText = d.getElementsByClassName('userContent')[0] || d.querySelector('._3dp._29k ._1_s');
                            if (typeof descText != 'undefined' && descText) {
                                //descText = data[i].querySelector('._3dp._29k ._1_s')[0];
                                descText = descText.textContent.substr(0,1000).trim();
                            }
                        }
                        ahref.setAttribute('data-text', descText);

                        ahref.addEventListener('click', function (o, e) {
                            if (this.innerHTML.indexOf('Saved')>-1) return false;

                            var fbLink = this.getAttribute('data-link');
                            var fbUser = this.getAttribute('data-user');
                            var fbText = this.getAttribute('data-text');
                            chrome.storage.local.get('fbSaveLater', function (o) {
                                if (chrome.runtime.lastError) {
                                    console.log("ERROR - GET failed: " + chrome.runtime.lastError.message);
                                }

                                var savedList, descObj;
                                if (o.fbSaveLater) {
                                    savedList = o.fbSaveLater['links'];
                                    descObj = o.fbSaveLater['desc'];
                                }

                                if (typeof savedList == 'undefined' || !savedList || savedList == null || savedList == '') savedList = [];
                                savedList.push(fbLink);
                                if (typeof descObj == 'undefined' || !descObj || descObj == null || descObj == '') descObj = {text: {}, src: {}};
                                descObj.text[fbLink] = fbText;
                                descObj.src[fbLink] = fbUser;

                                chrome.storage.local.set({
                                    'fbSaveLater': {links: savedList, desc: descObj}
                                }, function (o) {
                                    if (chrome.runtime.lastError) {
                                        console.log("ERROR: " + chrome.runtime.lastError.message);
                                    }
                                });
                                storage = {links: savedList, desc: descObj};
                            });
                            this.innerHTML = 'Saved';
                            this.className = 'fb-save-4-later saved';
                        }, true);
                    }
                    if (isNewsFeed) {
						if (injectionWrapper) {
							injectionWrapper.appendChild(document.createTextNode(" · "));
							injectionWrapper.appendChild(ahref);
						}
                    }
                    else {
                        //injectionWrapper.querySelector('._1_n').appendChild(document.createTextNode(" · "));
                        //injectionWrapper.querySelector('._1_n').appendChild(ahref);
                        var tempInjectWrapper = d.querySelector('.fbTimelineFeedbackActions');
						if (tempInjectWrapper) {
							tempInjectWrapper.appendChild(document.createTextNode(" · "));
							tempInjectWrapper.appendChild(ahref);
						}
                    }
                }
            }
        }
    //}
}
injectLinks();
document.addEventListener('DOMContentLoaded', function(){
    injectLinks();
});
//document.getElementById('contentArea').addEventListener('DOMNodeInserted', injectLinks);
// Load Readmore when scroll to end of page
//$(window).scroll(function () {if ($(document).height() <= $(window).scrollTop() + $(window).height()) { injectLinks();} });
window.onscroll = function(ev) {
    //if ((window.innerHeight + window.scrollY) >= parseInt(document.body.offsetHeight/2)) {
        injectLinks();
    //}
};