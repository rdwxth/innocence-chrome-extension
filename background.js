chrome.runtime.onInstalled.addListener(function () {
    const defaultValues = {
      innocentWebsites: [], // Innocent exepmpt sites database
      replace_sites: [
        { url: 'https://www.khanacademy.org/' },
        { url: 'https://www.coursera.org/' },
        { url: 'https://www.udacity.com/' },
        { url: 'https://docs.google.com/' },
        { url: 'https://drive.google.com/' },
        { url: 'https://www.google.com/' },
        { url: 'https://mail.google.com/' },
        { url: 'https://calendar.google.com/' },
        { url: 'https://www.youtube.com/' },
        { url: 'https://stackoverflow.com/' },
        { url: 'https://www.microsoft.com/' },
        { url: 'https://office.live.com/' },
        { url: 'https://www.linkedin.com/' },
        { url: 'https://www.wikipedia.org/' },
        { url: 'https://news.ycombinator.com/' },
        { url: 'https://www.nytimes.com/' },
        { url: 'https://www.bbc.com/' },
        { url: 'https://www.nasa.gov/' },
        { url: 'https://www.economist.com/' },
        { url: 'https://www.nationalgeographic.com/' }
      ]
    };
  
    chrome.storage.local.set(defaultValues, function () {
      console.log('Default values set in chrome.storage.local.');
    });
  });
  
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'replaceHistory') {
      replaceHistory();
    } else if (request.action === 'removeFromHistory') {
      removeFromHistory(request.url);
    }
  });
  
  const contextMenuId = 'add-to-innocent-history';
  
  chrome.contextMenus.create({
    id: contextMenuId,
    title: 'Add to Innocent History',
    contexts: ['page', 'link']
  });
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === contextMenuId) {
      addWebsiteToDatabase(info.pageUrl || info.linkUrl);
    }
  });
  
  function addWebsiteToDatabase(url) {
    chrome.storage.local.get({ innocentWebsites: [] }, function (result) {
      const innocentWebsites = result.innocentWebsites || [];
      const domain = extractDomain(url);
  
      if (!innocentWebsites.some((site) => site.url === domain)) {
        innocentWebsites.push({ url: domain, timestamp: Date.now() });
        chrome.storage.local.set({ innocentWebsites }, function () {
          console.log(`${domain} added to the Innocent History database.`);
        });
      } else {
        console.log(`${domain} is already in the Innocent History database.`);
      }
    });
  }
  
  function extractDomain(url) {
    // extract domain from URL
    const match = url.match(/^https?:\/\/([^/?#]+)/i);
    return match && match[1];
  }
  
  
  function removeFromHistory(url) {
    console.log('Removing URL from history:', url);
  
    chrome.history.deleteUrl({ url: url }, function () {
      if (chrome.runtime.lastError) {
        console.error('Error removing URL from history:', chrome.runtime.lastError);
        return;
      }
  
      console.log(`${url} removed from browsing history.`);
    });
  }
  
  function replaceHistory() {
    chrome.storage.local.get({ replace_sites: [] }, function (result) {
      const replaceSites = result.replace_sites || [];
  
      if (replaceSites.length === 0) {
        console.log('No websites to replace in history.');
        return;
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setMilliseconds(tomorrow.getMilliseconds() - 1);
  
      chrome.history.search({ text: '', startTime: today.getTime(), endTime: tomorrow.getTime() }, function (historyItems) {
        if (chrome.runtime.lastError) {
          console.error('Error in history search:', chrome.runtime.lastError);
          return;
        }
  
        console.log('History items to be replaced:', historyItems);
  
        historyItems.forEach((historyItem) => {
          console.log('Replacing:', historyItem);
          const matchingSite = true;
          const randomSite = replaceSites[Math.floor(Math.random() * replaceSites.length)];

          if (matchingSite) {
            // remove from history
            chrome.history.deleteUrl({ url: historyItem.url }, function () {
              if (chrome.runtime.lastError) {
                console.error('Error removing URL from history:', chrome.runtime.lastError);
                return;
              }
              console.log(`${historyItem.url} removed from browsing history.`);
            });

            // add the fake site to history
            chrome.history.addUrl({
              url: randomSite.url
            }, function () {
              if (chrome.runtime.lastError) {
                console.error('Error adding URL back to history:', chrome.runtime.lastError);
                return;
              }
              console.log(`Added ${randomSite.url} to history.`);
            });
          }
        });
  
        console.log('Browser history replaced with predefined websites.');
      });
    });
  }
  
  