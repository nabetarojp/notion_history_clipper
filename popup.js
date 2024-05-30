document.getElementById('copy').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.update(tabs[0].id, {active: true}, () => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'download_updates'}, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
          } else if (response && response.status === 'success') {
            console.log('Updates downloaded as text file successfully.');
          } else if (response && response.status === 'unsupported') {
            console.error('Downloading updates is not supported in the background script.');
          } else {
            console.error('Unexpected response:', response);
          }
        });
      });
    });
  });
