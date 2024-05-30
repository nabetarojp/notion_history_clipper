chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copy_to_clipboard') {
      sendResponse({status: 'unsupported'});
    }
    return true;
  });
