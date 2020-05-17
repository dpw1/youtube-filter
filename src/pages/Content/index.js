import { printLine } from './modules/print';

printLine("Using the 'printLine' function from the Print Module");

window.ytFilter = window.ytFilter || {};

window.ytFilter = (function () {
  const selectors = {
    timeStamps: `ytd-search yt-img-shadow[class] + .ytd-thumbnail span[class*='ytd-thumbnail-overlay-time-status-renderer']`,
    videoElements: `#primary ytd-item-section-renderer:nth-child(2) > #contents > [class]`,
    videoElementsBasic: `ytd-video-renderer[class]`,
    videoElementsContainer: `#contents.style-scope.ytd-item-section-renderer `,
    scrollAmount: 0,
    auxiliarDOMJsonHolder: 'ytVideos',
  };

  function _moveDOMElement(parent, child) {
    document.querySelector(parent).appendChild(document.querySelector(child));
  }

  function _waitUntilElementExists(selector, callback) {
    const el = document.querySelector(selector);

    if (el) {
      return callback(el);
    }

    setTimeout(() => _waitUntilElementExists(selector, callback), 500);
  }

  async function _waitForAllVideosToLoad(selector, value, callback) {
    return new Promise(function (resolve, reject) {
      const el = document.querySelectorAll(selector);

      value = parseInt(localStorage.getItem('youtubeVideosData'));

      console.log('waiting for all vids to load...', el.length, value);

      if (el.length >= value) {
        console.log('loaded all videos!');
        return resolve(el);
      }

      setTimeout(() => _waitForAllVideosToLoad(selector, callback), 500);
    });
  }

  function _convertToSeconds(value) {
    const split = value.split(':').reverse();
    let result = Number(split[0]) + Number(split[1] * 60);
    return split.length > 2 ? (result += Number(split[2] * 3600)) : result;
  }

  function _addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }

  function _isSearchPage() {
    return /search_query/.test(window.location.href);
  }

  function _listenForNewLoadedVideos(callback) {
    const target = document.querySelector(
      `#contents.style-scope.ytd-item-section-renderer`
    );

    const observer = new WebKitMutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        callback(mutation);
      });
    });
    observer.observe(target, {
      attributes: true,
      childList: true,
      characterData: false,
      subtree: false,
    });
  }

  function _findKeyWithinJSON(obj, key, array) {
    array = array || [];
    if ('object' === typeof obj) {
      for (let k in obj) {
        if (k === key) {
          array.push(obj[k]);
        } else {
          _findKeyWithinJSON(obj[k], key, array);
        }
      }
    }
    return array;
  }

  async function _getTimeStamps() {
    /**
     *
     * Returns JSON with all videos data.
     *
     * 1. Injects script tag to DOM
     * 2. Gets the window["ytInitialData"] object (it contains all the data of the youtube videos)
     * 3. Injects the window["ytInitialData"] as sanitised JSON in a hidden div
     * 4. Manipulates this JSON within the chrome extension
     */

    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.text = `
      var vids;
            try{
                vids = window["ytInitialData"].contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
            } catch (er){
                vids = window.youtubeVideos = window["ytInitialData"].contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
            }
    
            var videosData = JSON.stringify(vids);
            document.body.insertAdjacentHTML("beforebegin", "<div id='${selectors.auxiliarDOMJsonHolder}' style='display:none;width:0;height:0;pointer-events:none;'>"+videosData+"</div>")
        `;

      document.getElementsByTagName('head')[0].appendChild(script);

      let auxVideo = document.getElementById(selectors.auxiliarDOMJsonHolder);
      let data = _findKeyWithinJSON(
        JSON.parse(auxVideo.innerText),
        'videoRenderer'
      );

      script.remove();
      auxVideo.remove();
      resolve(data);
    });
  }

  async function resetScrollLimitToHideVideos() {
    localStorage.setItem('scrolledDistance', 1);
  }

  async function hideVideos() {
    let processedJSON;

    try {
      processedJSON = await _getTimeStamps();
    } catch (err) {
      console.log(`bug fetching, tried again: ${processedJSON}`);
    }

    const min = _convertToSeconds('1:00');
    const max = _convertToSeconds('3:00');

    for (const [i, each] of processedJSON.entries()) {
      let time;
      let id;

      try {
        time = each.lengthText
          ? _convertToSeconds(each.lengthText.simpleText)
          : undefined;
        id = each.videoId;
      } catch (err) {
        console.log(err);
      } finally {
        const keepVideoOnTheList = min <= time && max >= time;

        if (!id) {
          return;
        }

        /**
         * Removes all hidden videos by video id
         */

        if (!keepVideoOnTheList || !time) {
          setTimeout(() => {
            const el = document.querySelector(`[href*='${id}'][rel]`);

            if (!el) {
              return;
            }

            return el.closest('ytd-video-renderer').remove();
          }, 50);
        }
      }
    }
  }

  async function hideVideosOnScroll() {
    let updateEveryYPixelsScrolled = 60; //every Y pixels scrolled will update videos

    let totalScrolled = localStorage.getItem('scrolledDistance')
      ? parseInt(localStorage.getItem('scrolledDistance'))
      : 1;

    let totalNeededToScrollToUpdateAgain =
      updateEveryYPixelsScrolled * totalScrolled;

    console.log(totalNeededToScrollToUpdateAgain);

    if (window.scrollY >= totalNeededToScrollToUpdateAgain) {
      console.log('updating on scroll!');
      let amount = (totalScrolled += 1);
      localStorage.setItem('scrolledDistance', parseInt(amount));
      hideVideos();
    }
  }

  async function handlePageChange(request, sender) {
    const currentURL = request.tab.url;
    const previousURL = localStorage.getItem('previousURL');

    console.log('request from tab: ', request.tab);

    if (currentURL === previousURL) {
      console.log('Same page as previous one: ', previousURL);
    } else if (currentURL !== previousURL && _isSearchPage()) {
      console.log('New page.');

      localStorage.setItem('previousURL', currentURL);

      if (request.tab.openerTabId) {
        console.log('reload this tab:', request);

        chrome.runtime.sendMessage({ tabIdToReload: request.tab.id });
      } else if (!request.tab.openerTabId) {
        window.location.reload();
      }
    }

    if (_isSearchPage()) {
      console.log('** SEARCH PAGE LOADED **');

      resetScrollLimitToHideVideos();
      hideVideos();
      window.onscroll = function (e) {
        hideVideosOnScroll();
      };
    }
  }

  return {
    init: function () {
      window.onload = function () {
        chrome.runtime.onMessage.addListener((request, sender) => {
          setTimeout(handlePageChange(request, sender), 50);
        });
      };
    },
  };
})();

window.ytFilter.init();
