document.addEventListener('DOMContentLoaded', function () {
    // load existing sites from storage and display them
    chrome.storage.local.get({ replace_sites: [] }, function (result) {
      const replaceSites = result.replace_sites || [];
      displaySites(replaceSites);
    });
  
    document.getElementById('replaceHistoryButton').addEventListener('click', function () {
      replaceHistory();
    });
  
    document.getElementById('clearAllSitesButton').addEventListener('click', function () {
      clearAllSites();
    });
    
    document.getElementById('addSiteButton').addEventListener('click', function () {
        addSite();
      });   
  });
  

  function displaySites(sites) {
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = '';
  
    sites.forEach(function (site, index) {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${site.url}`;
      siteList.appendChild(listItem);
    });
  }
  
  function addSite() {
    const newSiteInput = document.getElementById('newSite');
    const newSiteUrl = newSiteInput.value.trim();
  
    if (newSiteUrl !== '') {
      chrome.storage.local.get({ replace_sites: [] }, function (result) {
        const replaceSites = result.replace_sites || [];
        console.log('replaceSites:', replaceSites);
        replaceSites.push({ url: newSiteUrl });
        
        // Save the updated replace_sites array
        chrome.storage.local.set({ replaceSites }, function () {
          console.log(`${newSiteUrl} added to replace_sites.`);
          displaySites(replaceSites);
          newSiteInput.value = '';
        });
      });
    }
  }
  
  // replace browser history
  function replaceHistory() {
    chrome.runtime.sendMessage({ action: 'replaceHistory' });
    console.log('Replacement of browser history triggered.');
  }
  
  // clear all sites from the replace_sites array
  function clearAllSites() {
    chrome.storage.local.set({ replace_sites: [] }, function () {
      console.log('All sites cleared from replace_sites.');
      displaySites([]);
    });
  }
  