// content.js

// check if current URL is in the list of innocent websites
chrome.storage.local.get({ innocentWebsites: [] }, function (result) {
    const innocentWebsites = result.innocentWebsites || [];
    const currentUrl = window.location.href;
  
    console.log('Current URL:', currentUrl);
  
    const matchingSite = innocentWebsites.find((site) => currentUrl.startsWith(site.url));
  
    if (matchingSite) {
      console.log('Match found in innocent history database.');
  
      // remove URL from browsing history
      chrome.runtime.sendMessage({ action: 'removeFromHistory', url: currentUrl });
    } else {
      console.log('No match found in innocent history database.');
    }
  });
  