document.addEventListener('DOMContentLoaded', function() {
  let designModeEnabled = false;

  // Enable all disabled inputs
  document.getElementById('enable-inputs').addEventListener('click', function() {
    executeScript(() => {
      const disabledElements = document.querySelectorAll('*:disabled');
      disabledElements.forEach(element => element.disabled = false);
      return disabledElements.length;
    }, (results) => {
      const count = results[0].result;
      showFeedback(`Enabled ${count} element${count !== 1 ? 's' : ''}`);
    });
  });

  // Show passwords by changing input type
  document.getElementById('show-passwords').addEventListener('click', function() {
    executeScript(() => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => input.type = 'text');
      return passwordInputs.length;
    }, (results) => {
      const count = results[0].result;
      showFeedback(`Revealed ${count} password${count !== 1 ? 's' : ''}`);
    });
  });

  // Toggle design mode
  document.getElementById('design-mode').addEventListener('click', function() {
    designModeEnabled = !designModeEnabled;
    executeScript((enabled) => {
      document.designMode = enabled ? 'on' : 'off';
      return enabled;
    }, (results) => {
      const enabled = results[0].result;
      showFeedback(`Design mode ${enabled ? 'enabled' : 'disabled'}`);
    }, designModeEnabled);
  });

  // Helper function to execute scripts in the active tab
  function executeScript(func, callback, ...args) {
    chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
      if (tab) {
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: func,
          args: args
        }).then(callback).catch(error => {
          console.error('Error executing script:', error);
          showFeedback('Error: Cannot access this page');
        });
      }
    });
  }

  // Show feedback to the user
  function showFeedback(message) {
    // Check if feedback element exists
    let feedbackElement = document.getElementById('feedback');

    // Create it if it doesn't exist
    if (!feedbackElement) {
      feedbackElement = document.createElement('div');
      feedbackElement.id = 'feedback';
      feedbackElement.className = 'feedback';
      document.querySelector('.container').appendChild(feedbackElement);

      // Add styles for the feedback element
      const style = document.createElement('style');
      style.textContent = `
        .feedback {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--accent-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s;
          text-align: center;
          max-width: 90%;
          z-index: 1000;
        }
        .feedback.show {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    // Show the feedback
    feedbackElement.textContent = message;
    feedbackElement.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
      feedbackElement.classList.remove('show');
    }, 2000);
  }
});
