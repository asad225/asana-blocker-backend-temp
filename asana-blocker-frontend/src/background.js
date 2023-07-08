
// background.js

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === 'click') {
//       // Send the message to the Angular application
//       chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, message);
//       });
//     }
//   });
  
// ========================================================================================

// background.js
// background.js

// background.js

// background.js

// background.js









// ---------------=============================================================










var intervalStarted = false;

chrome.runtime.onMessage.addListener((req, sender, res) => {
    console.log('Worker Listens to message');
    if (req.rewardMethod === 'automatic' || req.runAutomaticOnCurrentWindow) {
        handleAutomaticRewardMethod(req);
        return;
    }
    if (req.stop) {
        chrome.storage.local.set({
            stop: true
        });
        chrome.storage.local.remove('backgroundToken');
        chrome.storage.local.remove('backgroundTaskId');
        chrome.storage.local.remove('assigneeId');
        chrome.storage.local.remove('asanaTaskCheckInterval');
        chrome.storage.local.remove('intervalInMinutes');
        chrome.storage.local.remove('submittedWebsites');
        chrome.storage.local.remove('timeleft');
        chrome.storage.local.remove('allowToUnblockBlock');
        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, (tabs) => {
                let currentTabId = tabs[0].id;
                executeContentScript(currentTabId);
                chrome.tabs.sendMessage(currentTabId, {
                    stop: true
                });
            });
        });
        return;
    } else {
        chrome.storage.local.remove('stop');
    }

    chrome.storage.local.set({
        'backgroundToken': req.token,
        'backgroundTaskId': req.taskId,
        'assigneeId': req.assigneeId,
        'intervalInMinutes': req.intervalInMinutes,
        'asanaTaskCheckInterval': req.asanaTaskCheckInterval,
        'submittedWebsites': req.submittedWebsites
    });

    if (req.submittedWebsites && req.intervalInMinutes) {
        chrome.storage.local.get('timeleft', (storage) => {
            let timeleft = storage.timeleft || {};
            timeleft.timer = timeleft.timer || 0;

            chrome.storage.local.set({
                timeleft: timeleft
            });
        });
    }
    
    createAsanaAlarm();
    return true;
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get('stop', (stop) => {
        if (!stop.stop) {
            chrome.storage.local.get('backgroundToken', (storageToken) => {
                chrome.storage.local.get('backgroundTaskId', (storageTask) => {
                    let token = storageToken.backgroundToken;
                    let task = storageTask.backgroundTaskId;
        
                    // if (token && task) {
                    //     fetch(`https://app.asana.com/api/1.0/tasks/${task}`, {
                    //         method: 'GET',
                    //         headers: {
                    //             Accept: 'application/json',
                    //             Authorization: `Bearer ${token}`
                    //         }
                    //     })
                    //     .then(response => response.json())
                    //     .then(json => {
                    //         chrome.storage.local.get('assigneeId', (value) => {
                    //             let assigneeId = value.assigneeId;
                    //             setUnblock(json, assigneeId);
                    //         });
                    //     });
                    // }
                });
            });
        }
    });
});

const setUnblock = (data, assigneeId) => {
    const asanaAssigneeId = data?.data?.assignee?.gid;
    const condition = data.data.completed
    && (!assigneeId || (asanaAssigneeId === assigneeId));
    chrome.storage.local.get('tick', (tStor) => {
        chrome.storage.local.get('allowToUnblockBlock', (unblock) => {
            chrome.windows.getCurrent(w => {
                chrome.tabs.query({active: true, windowId: w.id}, (tabs) => {
                    let currentTabId = tabs[0].id;
                    executeContentScript(currentTabId);
                    // console.log(`Tick: `, tStor.tick);
                    if (tStor.tick === undefined) {
                        chrome.storage.local.set({
                            allowToUnblockBlock: false
                        }, () => {
                            if (!unblock || unblock.allowToUnblockBlock === undefined || unblock.allowToUnblockBlock) {
                                handleTabActions(currentTabId);
                            }
                        });
                    } else if (!tStor.tick && condition) {
                        setTimeout(() => {
                            chrome.tabs.sendMessage(currentTabId, {
                                history: 'tick'
                            });
                        }, 100);
                        chrome.storage.local.set({
                            allowToUnblockBlock: true
                        }, () => {
                            if (unblock && !unblock.allowToUnblockBlock) {
                                handleTabActions(currentTabId);
                            }
                        });

                        chrome.storage.local.get('intervalInMinutes', (mStorage) => {
                            if (mStorage.intervalInMinutes) {
                                chrome.storage.local.set({
                                    initialTimeleft: mStorage.intervalInMinutes*60
                                });
                            }
                        });
                    } else if (tStor.tick && !condition) {
                        chrome.storage.local.set({
                            allowToUnblockBlock: false
                        }, () => {
                            if (!unblock || unblock.allowToUnblockBlock === undefined || unblock.allowToUnblockBlock) {
                                handleTabActions(currentTabId);
                            }
                        });
                    } else {
                        setTimeout(() => {
                            chrome.tabs.sendMessage(currentTabId, {
                                lifespan: true
                            });
                        }, 100);
                    }
                });
            });
        });
        chrome.storage.local.set({
            tick: condition
        });
    });
}

const createAsanaAlarm = () => {
    chrome.storage.local.get('asanaTaskCheckInterval', (storage) => {
        chrome.alarms.create(
            "check_asana_task",
            {
                delayInMinutes: +storage?.asanaTaskCheckInterval || 0.02,
                periodInMinutes: +storage?.asanaTaskCheckInterval || 0.02
            }
        );
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get('stop', (stop) => {
        if (!stop.stop) {
            if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
                handleTabActions(tabId, true);
            }
        }
    });
});

chrome.tabs.onActivated.addListener((tab) => {
    chrome.storage.local.get('stop', (stop) => {
        if (!stop.stop) {
            handleTabActions(tab.tabId);
        }
    });
});

function handleTabActions(tabId, fromUpdated) {
    chrome.storage.local.get('isBlocking', (isBlocking) => {
        if (!isBlocking.isBlocking) return;
        chrome.storage.local.get('interval', (interval) => {
            chrome.storage.local.get('timeleft', (tStorage) => {
                chrome.tabs.get(tabId, (currTab) => {
                    chrome.storage.local.get('allowToUnblockBlock', (unblock) => {
                        chrome.storage.local.get('submittedWebsites', (websites) => {
                            let splitUrl = currTab.url.split('/')[2] ? currTab.url.split('/')[2].split('www.') : [];
                            let currUrl = splitUrl[0] || splitUrl[1];
                            let timeleft = tStorage.timeleft;
    
                            // console.log(`Allow to unblock (from tabAction): ${unblock?.allowToUnblockBlock}`);
    
                            if (interval.interval) {
                                clearInterval(interval.interval);
                            }
    
                            executeContentScript(currTab.id);
                            if (unblock && !unblock.allowToUnblockBlock) {
                                setTimeout(() => {
                                    chrome.tabs.sendMessage(currTab.id, {tab: currTab, unblockWebsite: false});
                                }, 100);
                                chrome.storage.local.remove('interval');
                                return;
                            }
    
                            if (websites.submittedWebsites && !websites.submittedWebsites.find(w => w.name === currUrl)) {
                                // console.log(`Website is not being monitored...`);
                                return;
                            } else {
                                // console.log(`${currUrl} is being monitored...`);
                            }
    
                            if (timeleft > 0) {
                                setTimeout(() => {
                                    chrome.tabs.sendMessage(currTab.id, {tab: currTab, unblockWebsite: true, timeleft});
                                }, 100);
                                setIntervalForTimeleft(currUrl, timeleft, currTab);
                            } else if (unblock && unblock.allowToUnblockBlock) {
                                chrome.storage.local.get('intervalInMinutes', (mStorage) => {
                                    if (mStorage.intervalInMinutes) {
                                        if (!intervalStarted) {
                                            historySave({
                                                action: 'Unblock interval start',
                                                description: `Unblocked websites for ${mStorage.intervalInMinutes} minutes`
                                            });
                                            intervalStarted = true;
                                        }
                                        setTimeout(() => {
                                            chrome.tabs.sendMessage(currTab.id, {tab: currTab, unblockWebsite: true, timeleft: mStorage.intervalInMinutes*60});
                                        }, 100);
                                        setIntervalForTimeleft(currUrl, mStorage.intervalInMinutes*60, currTab);
                                    }
                                });
                            } else {
                                // console.log(`You're not allowed to unblock this website...`);
                                setTimeout(() => {
                                    chrome.tabs.sendMessage(currTab.id, {tab: currTab, unblockWebsite: false});
                                }, 100);
                            }
                        });
                    });
                });
            });
        });
    });
}

function setIntervalForTimeleft(currUrl, timeleft, currTab) {
    chrome.storage.local.get('stop', (stop) => {
        if (!stop.stop) {
            let tmpInterval = setInterval(() => {
                chrome.storage.local.get('allowToUnblockBlock', (unblock) => {
                    if (timeleft <= 0 || (unblock && !unblock.allowToUnblockBlock)) {
                        // console.log('This should block the page...!!!');
                        setTimeout(() => {
                            chrome.tabs.sendMessage(currTab.id, {tab: currTab, unblockWebsite: false});
                        }, 100);
                        historySave({
                            action: 'Unblock interval finish',
                            description: `Finished unblocking the websites`
                        });
                        chrome.storage.local.set({
                            allowToUnblockBlock: false
                        });
                        chrome.storage.local.remove('interval');
                        clearInterval(tmpInterval);
                    }
                    chrome.storage.local.remove('initialTimeleft');
                    timeleft-=1;
                    // console.log(`${currUrl}: ${timeleft}`);
                    chrome.storage.local.set({
                        timeleft: timeleft
                    });
                    intervalStarted = false;
                });
            }, 1000);
            chrome.storage.local.set({
                interval: tmpInterval
            });
        }
    });
}

function executeContentScript(tabId) {
    chrome.scripting.executeScript({
        target: {tabId},
        files: ['contentScript.js']
    });
}

function historySave(histObj) {
    chrome.storage.local.get('history', (storage) => {
        if (storage.history) {
            const history = storage.history;
            if (history.length > 500) {
                history.pop();
            }

            let currentDate = new Date();
            let date = '';
            date += `0${currentDate.getMonth()+1}`.slice(-2);
            date += `/` + `0${currentDate.getDate()}`.slice(-2);
            date += `/${currentDate.getFullYear()}`;
            date += ` ${currentDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3").slice(0, 5)}`

            history.unshift({
                ...histObj,
                date
            });

            chrome.storage.local.set({
                history
            });
        }
    });
}

function handleAutomaticRewardMethod(result) {
    console.log('result.runAutomaticOnCurrentWindow ', result);
    if (result.runAutomaticOnCurrentWindow) {
        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, (tabs) => {
                let currentTabId = tabs[0].id;
                executeContentScript(currentTabId);
                setTimeout(() => {
                    chrome.tabs.sendMessage(currentTabId, {
                        runAutomaticOnCurrentWindow: true
                    });
                }, 100);
            });
        });
    }
    const {mode, unblockWebsites, rewardTime} = result;
    if (unblockWebsites) {
        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, (tabs) => {
                let currentTabId = tabs[0].id;
                chrome.storage.local.set({
                    intervalInMinutes: rewardTime
                }, () => {
                    chrome.storage.local.set({
                        timeleft: rewardTime * 60
                    }, () => {
                        chrome.storage.local.set({
                            allowToUnblockBlock: true
                        }, () => {
                            handleTabActions(currentTabId);
                        });
                    });
                });
            });
        });
    }
}

  