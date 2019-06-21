chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      const youtubeTimeFilter = (function() {
        /* Variables */
        const submitButton = "youtubeFilterSubmit";
        let defaultSettings = {
          from: localStorage.getItem("youtubeFilterFrom") || "1:00",
          to: localStorage.getItem("youtubeFilterTo") || "5:00"
        };
        /* Helpers */
        const observeDOM = (function() {
          var MutationObserver =
            window.MutationObserver || window.WebKitMutationObserver;

          return function(obj, callback) {
            if (!obj || !obj.nodeType === 1) return; // validation

            if (MutationObserver) {
              // define a new observer
              var obs = new MutationObserver(function(mutations, observer) {
                callback(mutations);
              });
              // have the observer observe foo for changes in children
              obs.observe(obj, { childList: true, subtree: true });
            } else if (window.addEventListener) {
              obj.addEventListener("DOMNodeInserted", callback, false);
              obj.addEventListener("DOMNodeRemoved", callback, false);
            }
          };
        })();

        const convertToSeconds = value => {
          const split = value.split(":").reverse();
          let result = Number(split[0]) + Number(split[1] * 60);
          return split.length > 2
            ? (result += Number(split[2] * 3600))
            : result;
        };
        const waitUntilElementExists = (selector, callback) => {
          const el = document.querySelector(selector);

          if (el) {
            return callback(el);
          }

          setTimeout(() => waitUntilElementExists(selector, callback), 500);
        };

        /* Logic */

        /**
         * Injects two inputs and 'send' button into DOM t
         * to let user select the length of time to filter.
         * @param {*} _
         */
        const injectInput = _ => {
          const parent = document.querySelector(
            ".ytd-section-list-renderer > .style-scope.ytd-search-sub-menu-renderer > div"
          );
          const inputElement = `
          <div class="youtubeFilter">
          <p class="youtubeFilter__text">Show videos between:</p>
          <label for="youtubeFilterFrom">From: </label>	
          <input id="youtubeFilterFrom" value="${
            defaultSettings.from
          }" type="text"/>
                    <p class="youtubeFilter__text">and</p>
      <label for="youtubeFilterTo">To: </label> 
      <input id="youtubeFilterTo" value="${defaultSettings.to}" type="text"/>
      <button id="youtubeFilterSubmit" >Filter</button>
      </div>
      `;
          parent.insertAdjacentHTML("beforeend", inputElement);
        };
        const getUserData = _ => {
          const from = convertToSeconds(
            document.querySelector("#youtubeFilterFrom").value
          );
          const to = convertToSeconds(
            document.querySelector("#youtubeFilterTo").value
          );

          return { from, to };
        };

        /**
         * Filters all videos.
         * @param {*} buttonClickReload true = user clicked on the button. false = page was scrolled.
         */

        const filterVideos = (buttonClickReload = false) => {
          const { from, to } = getUserData();

          const timestampClass = `ytd-video-renderer:not(.youtubeFilter--keep-video) a .ytd-thumbnail-overlay-time-status-renderer`;

          waitUntilElementExists(timestampClass, _ => {
            const videoTimeLength = document.querySelectorAll(timestampClass);

            // console.log(videoTimeLength.length);

            [...videoTimeLength].map(video => {
              const videoLength = convertToSeconds(video.textContent);

              const keepVideoOnTheList =
                from <= videoLength && to >= videoLength;
              if (keepVideoOnTheList) {
                video
                  .closest("ytd-video-renderer")
                  .classList.add("youtubeFilter--keep-video");
              } else {
                const vidToRemove = video.closest("ytd-video-renderer");

                vidToRemove.classList.add("youtubeFilter--remove-video");

                setTimeout(() => {
                  vidToRemove.remove();
                }, 450);
              }
            });
          });
        };

        /**
         * Filters videos when the page is scrolled and new videos are loaded.
         * @param {*} _ no params
         *
         */
        const reloadFilter = _ => {
          waitUntilElementExists("#spinnerContainer.active", _ => {
            const cls = "#contents > ytd-item-section-renderer > #contents";
            setTimeout(() => {
              // const info =
              //   window.ytInitialData.contents.twoColumnSearchResultsRenderer
              //     .primaryContents.sectionListRenderer.contents[0]
              //     .itemSectionRenderer.contents;
              console.log(window.yt);
            }, 1);
            observeDOM(document.querySelector(cls), () => filterVideos(false));
          });
        };

        /**
         * Handles click of the filtering button. Once clicked forces a filter.
         * @param {*} _ no params
         */
        const handleClick = _ => {
          document.addEventListener("click", function(e) {
            if (e.target && e.target.id == submitButton) {
              let reloadPage = false;

              const from = document.querySelector("#youtubeFilterFrom").value;
              const to = document.querySelector("#youtubeFilterTo").value;

              if (
                localStorage.getItem("youtubeFilterFrom") !== from ||
                localStorage.getItem("youtubeFilterTo") !== to
              ) {
                reloadPage = true;
              }

              localStorage.setItem("youtubeFilterFrom", from);
              localStorage.setItem("youtubeFilterTo", to);

              if (reloadPage) location.reload();

              filterVideos(true);
            }
          });
        };

        /**
         * TODO: trigger filter when URL change.
         * @param {*} _
         */

        const detectURLChanges = _ => {
          window.addEventListener("locationchange", function() {
            location.reload();
          });
        };

        const init = () => {
          injectInput();
          getUserData();
          filterVideos();
          handleClick();
          reloadFilter();
          // detectURLChanges();
        };

        return {
          init
        };
      })();

      youtubeTimeFilter.init();
    }
  }, 10);
});
