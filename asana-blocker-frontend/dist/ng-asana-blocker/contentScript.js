var forSomePurposeIHaveToDeclareMoreGlobalVariableToCheckTheRepeatedContentScriptDarn;
var timerIntervalId = null;




// const  getCurrentUrl = async() => {
//  return new Promise((resolve, reject) => {
//    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//      if (tabs && tabs.length > 0) {
//        let url = tabs[0].url;
//        resolve(url);
//      } else {
//        reject(new Error("Unable to retrieve the URL."));
//      }
//    });
//  });
// }

function isSiteUrlMatched(siteUrl) {
//  getCurrentUrl()
//    .then((url) => {
//      console.log(url);
//      let activeTabUrl = String(url);
//      console.log(activeTabUrl)
//      console.log(activeTabUrl.includes(siteUrl));
//      if (!activeTabUrl.includes(siteUrl)) {
//        console.log("Tab not matched");
//      }
//      return activeTabUrl.includes(siteUrl);
//    })
//    .catch((error) => {
//      console.error(error);
//    });

    let activeTabUrl = document.location.href
    console.log(activeTabUrl)
    return activeTabUrl.includes(siteUrl)
}


let url = 'google.com'
let clickCount = 0;

function startTimer(url) {
  let startTime = 0;
  let totalPoint = 0;
  let isActive = true;
  let siteUrl = url
  console.log("start timer working");
  startTime = Date.now();

  // Check if the tab is active every second
  setInterval(() => {
    // If the tab is active and matches the provided site, check for recent click events
    if (isActive && isSiteUrlMatched(siteUrl)) {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;

      // Check if 5 minutes have passed since the last click event
      if (deltaTime >= 10000) {
        if (clickCount > 0) {
            totalPoint ++;
        }
        startTime = currentTime;
        clickCount = 0;
      }
    }
    console.log('total Point is ' + totalPoint)

    document.addEventListener("click", (event) => {
      if (isActive && isSiteUrlMatched(siteUrl)) {
        clickCount++;
      }
    });
    
    // this.clickEvents();
  }, 1000); // 1000 milliseconds = 1 second
}
// startTimer(url)



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'runSpecificFunction') {
        // Call your specific function and access the data
        console.log('data is ' + request.data)
        startTimer(request.data);
    }
    });
// .............................................................................................................

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.local.get("isBlocking", (isBlocking) => {
    if (!isBlocking.isBlocking) return;
    if (request.runAutomaticOnCurrentWindow) {
      runAutomaticOnCurrentWindow();
      return;
    }
    chrome.storage.local.remove("bgLifeTime");
    chrome.storage.local.set({
      bgLifeTime: new Date().getTime(),
    });

    if (request.stop) {
      window.location.reload();
      return;
    }

    if (request.lifespan) return;

    if (request.history === "tick") {
      historyTick();
    } else {
      console.log(`chrome.storage.local.get('isBlocking`);
      chrome.storage.local.get("isBlocking", (blocking) => {
        if (!blocking.isBlocking) {
          if (document.body.innerHTML === "Blocked by Asana blocker") {
            window.location.reload();
          }
        }
        console.log(`Content script loaded....`);
        chrome.storage.local.get("blockedWebsites", (storage) => {
          const elem = document.createElement("div");
          elem.innerHTML = "Blocked by Asana blocker";
          console.log(`blockedWebsites`, storage.blockedWebsites);
          if (storage.blockedWebsites && storage.blockedWebsites.length) {
            if (
              storage.blockedWebsites.find((website) => {
                const condition =
                  request.tab.url.includes(website.name) ||
                  website.name === "*";
                return condition;
              })
            ) {
              console.log(`storage.blockedWebsites.find`);
              chrome.storage.local.get("exceptionWebsites", (exStorage) => {
                console.log(`exceptionWebsites `, exStorage);
                if (
                  exStorage.exceptionWebsites &&
                  Object.values(exStorage.exceptionWebsites).find((w) =>
                    request.tab.url.includes(w.name)
                  )
                ) {
                  console.log(`exStorage.exceptionWebsites.find`);
                  if (document.body.innerHTML === elem.innerHTML) {
                    window.location.reload();
                  }
                  return;
                } else if (!request.unblockWebsite) {
                  console.log(`else if (!request.unblockWebsite) {`);
                  document.body.innerHTML = elem.innerHTML;
                  stopTimer();
                } else {
                  console.log(`else`);
                  if (document.body.innerHTML === elem.innerHTML) {
                    window.location.reload();
                  }
                  startTimerInterval();
                }
              });
            }
          } else {
            sendResponse(true);
          }
        });
      });
    }
  });
});

function historyTick() {
  chrome.storage.local.get("history", (storage) => {
    if (storage.history) {
      const history = storage.history;
      if (history.length > 500) {
        history.pop();
      }

      let currentDate = new Date();
      let date = "";
      date += `0${currentDate.getMonth() + 1}`.slice(-2);
      date += `/` + `0${currentDate.getDate()}`.slice(-2);
      date += `/${currentDate.getFullYear()}`;
      date += ` ${currentDate
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
        .slice(0, 5)}`;

      history.unshift({
        action: "Task tick",
        description: "Asana Task Ticked",
        date,
      });

      chrome.storage.local.set({
        history,
      });
    }
  });
}

function startTimerInterval() {
  timerIntervalId = setInterval(() => {
    setTimerToThepage();
  }, 333);
}

function stopTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
}

function setTimerToThepage() {
  chrome.storage.local.get("timeleft", (tStorage) => {
    if (tStorage && tStorage.timeleft && tStorage.timeleft > -1) {
      let timer = document.getElementById("motivation-extension-timer");

      if (!timer) {
        timer = document.createElement("div");
        timer.setAttribute("id", "motivation-extension-timer");
        timer.style.position = "absolute";
        timer.style.backgroundColor = "rgba(0, 128, 255, 0.8)";
        timer.style.padding = "5px";
        timer.style.top = "0";
        timer.style.right = "0";
        timer.style.zIndex = "99999";
        document.body.appendChild(timer);
      }

      timer.innerHTML = formatTime(tStorage.timeleft);
    } else {
      const timer = document.getElementById("motivation-extension-timer");
      if (timer) {
        timer.remove();
      }
      stopTimer();
    }
  });
}

function formatTime(seconds) {
  if (!seconds || seconds === -1) {
    return "00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function runAutomaticOnCurrentWindow() {
  // Automatic reward system
  if (
    forSomePurposeIHaveToDeclareMoreGlobalVariableToCheckTheRepeatedContentScriptDarn
  )
    return;
  forSomePurposeIHaveToDeclareMoreGlobalVariableToCheckTheRepeatedContentScriptDarn = true;
  chrome.storage.local.get("isBlocking", (isBlocking) => {
    console.log("Is blocking: ", isBlocking);
    const started = isBlocking.isBlocking;
    if (!started) return;
    chrome.storage.local.get("rewardMethod", (rewardMethod) => {
      console.log("Reward method: ", rewardMethod);
      const rewardMeth = rewardMethod?.rewardMethod;
      const isAutomatic = rewardMeth === "automatic";
      if (!isAutomatic) return;
      chrome.storage.local.get("automaticWebsites", (automaticWebsites) => {
        console.log("automaticWebsites: ", automaticWebsites);
        let goodWebsites;
        if (
          automaticWebsites.automaticWebsites &&
          automaticWebsites.automaticWebsites.length
        ) {
          goodWebsites = automaticWebsites.automaticWebsites;
        }
        if (!goodWebsites) return;

        chrome.storage.local.get("actionLevel", (actionLevel) => {
          console.log("actionLevel: ", actionLevel);
          const mode = actionLevel.actionLevel;
          if (!mode) return;

          const currentUrl = window.location.href
            ?.split("//")?.[1]
            ?.split("/")[0];
          if (!currentUrl) return;
          if (goodWebsites.find((w) => currentUrl.includes(w.name))) {
            detectHumanActions(mode);
          }
        });
      });
    });
  });
}

runAutomaticOnCurrentWindow();

function detectHumanActions(mode) {
  var activityTimeout;
  var inactivityTimeout;
  var rewardTime = {
    easy: 0.5,
    medium: 20,
    hard: 30,
  };
  var isInactive = false;

  clearTimeout(activityTimeout);
  clearTimeout(inactivityTimeout);

  // Mouse move event listener
  document.addEventListener("mousemove", handleActivity);

  // Mouse click event listener
  document.addEventListener("click", handleActivity);

  // Keyboard stroke event listener
  document.addEventListener("keydown", handleActivity);

  function handleActivity() {
    chrome.storage.local.get("timeleft", (timeleft) => {
      if (!timeleft.timeleft || timeleft.timeleft < 1) {
        console.log("An activity!");
        if (isInactive) {
          isInactive = false;
          resetActivityTimeout();
        }
        resetInactivityTimeout();
      }
    });
  }

  function resetActivityTimeout() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(function () {
      chrome.runtime.sendMessage({
        rewardMethod: "automatic",
        mode: mode,
        unblockWebsites: true,
        rewardTime: rewardTime[mode],
      });
      clearTimeout(activityTimeout);
      clearTimeout(inactivityTimeout);
      console.log(`Unlocking for ${rewardTime[mode]} minutes`);
    }, rewardTime[mode] * 60 * 1000);
    var timer = 0;
    setInterval(() => {
      timer += 1;
      console.log(timer);
    }, 1000);
  }

  function resetInactivityTimeout() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(function () {
      console.log("User is inactive for 5 minutes.");
      clearTimeout(activityTimeout);
    }, 5 * 60 * 1000); // 5 minutes threshold
  }

  resetInactivityTimeout();
  resetActivityTimeout();
}

// setInterval(function () {
//   // content.js

//   document.addEventListener("click", function (event) {
//     // Create and send the message to the background script
//     // chrome.runtime.sendMessage({
//     //   action: "click",
//     //   data: event.target.innerText,
//     // });
//     console.log('CLicked' + event )
//   });
// }, 1000);

// console.log("content script is working");
