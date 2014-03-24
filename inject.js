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
							if (injectionWrapper && typeof injectionWrapper.length == 'undefined') injectionWrapper = [injectionWrapper];
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

                        var descUser, descUserWrapper;
                        if (isNewsFeed) {
                            if (isNewDesign) {
                                descUserWrapper = d.querySelector('._6nl:not(._6td) a');
								if (!descUserWrapper) //descUser = descUserWrapper.textContent; else
                                {
                                    //descUser = d.querySelector('._5pbw .fwn.fcg span').textContent;
                                    descUserWrapper = d.querySelector('._5pbw .fwn.fcg span');
                                }
                            } else descUserWrapper = d.querySelector('a');
                        }
                        else descUserWrapper = d.querySelector('.fcg a');
                        if (descUserWrapper) descUser = descUserWrapper.textContent;
                        else descUser = "Unknown source";
                        ahref.setAttribute('data-user', descUser);

                        var descText, descTextWrapper;
                        if (isNewsFeed) {
                            if (isNewDesign) {
                                descTextWrapper = d.querySelector('.userContentWrapper ._5pbx.userContent');
                                if (typeof descTextWrapper == 'undefined' || !descTextWrapper) {
                                    descTextWrapper = d.querySelector('.userContentWrapper .userContent');
                                    if (typeof descTextWrapper == 'undefined' || !descTextWrapper) {
                                        descTextWrapper = d.querySelector('._6nl:not(._6td)');
                                    }
                                }
                                //descText = descTextWrapper.textContent.trim();
                            } else {
                                descTextWrapper = d.querySelector('.userContentWrapper ._5pbx.userContent');
                                if (typeof descTextWrapper == 'undefined' || !descTextWrapper) {
                                    descTextWrapper = d.querySelector('._5pbw');
                                }
                            }
                        } else {
                            descTextWrapper = d.getElementsByClassName('userContent')[0] || d.querySelector('._3dp._29k ._1_s');
                            // if (typeof descTextWrapper == 'undefined' || !descTextWrapper) {
                            //     descTextWrapper = d.querySelector('._5pbw');
                            // }
                            // if (typeof descTextWrapper != 'undefined' && descTextWrapper) {
                            //     //descText = data[i].querySelector('._3dp._29k ._1_s')[0];
                            //     descText = descTextWrapper.textContent.substr(0,5000).trim();
                            // }
                        }
                        if (typeof descTextWrapper != 'undefined' && descTextWrapper) {
                            //descText = descTextWrapper.textContent.substr(0,1000);
                            descText = descTextWrapper.innerHTML;
                        } else descText = "";
                        ahref.setAttribute('data-text', encodeURIComponent(descText));

                        var descPreview = descTextWrapper.nextSibling;
                        var htmlPreview;
                        // Easy case: Link preview
                        if (descPreview && descPreview.textContent.trim() != '') {
                            htmlPreview = descPreview.innerHTML.trim();
                        }
                        else {
                            // Hard case: FB Post share preview
                            descPreview = descTextWrapper.parentNode;
                            var retry = 1;
                            while (
                                (descPreview.className.indexOf('userContentWrapper') == -1 &&
                                 descPreview.className.indexOf('mtm') == -1)
                                && retry++ < 4) {
                                descPreview = descPreview.parentNode;
                            }
                            // Get both TEXT & PHOTO
                            if (descPreview.className.indexOf('mtm') !== -1) {
                                // Facebook similar posts grouping
                                htmlPreview = descPreview.innerHTML;
                            } else {
                                // Normal posts
                                var descPreviewSibling = descPreview.nextSibling;
                                if (descPreviewSibling) {
                                    htmlPreview = descPreviewSibling.innerHTML;
                                    if (descPreviewSibling = descPreviewSibling.nextSibling) htmlPreview += descPreviewSibling.innerHTML;
                                }
                            }
                        }
                        if (!htmlPreview) htmlPreview = '';
                        else {
                            if (htmlPreview.indexOf('_4-u2 mbl _5us6') > -1) continue;
                            htmlPreview.replace(/<form[^]+<\/form>/,'');
                            ahref.setAttribute('data-preview', encodeURIComponent(htmlPreview));
                        }

                        //var isPublic = document.querySelector('.sx_d601ff')?-1:(d.querySelector('.sx_25f2b2')?1:0);
                        var isPublic = (href[0].href.indexOf('/groups/')>-1)?-1:(d.querySelector('.sx_25f2b2')?1:0);
                        ahref.setAttribute('data-public', isPublic);

                        ahref.addEventListener('click', function (o, e) {
                            if (this.innerHTML.indexOf('Saved')>-1) return false;

                            var fbLink = this.getAttribute('data-link');
                            var fbUser = this.getAttribute('data-user');
                            var fbText = this.getAttribute('data-text');
                            var fbPreview = this.getAttribute('data-preview');
                            var fbPublic = this.getAttribute('data-public');
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
                                if (typeof descObj == 'undefined' || !descObj || descObj == null || descObj == '') {
                                    descObj = {text: {}, src: {}, preview: {}, public: {}, savedtime: {}};
                                }
                                descObj.text[fbLink] = fbText;
                                descObj.src[fbLink] = fbUser;
                                if (typeof descObj.preview == 'undefined') descObj.preview = {};
                                descObj.preview[fbLink] = fbPreview || '';
                                if (typeof descObj.public == 'undefined') descObj.public = {};
                                descObj.public[fbLink] = fbPublic;
                                if (typeof descObj.savedtime == 'undefined') descObj.savedtime = {};
                                descObj.savedtime[fbLink] = (new Date()).getTime();

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