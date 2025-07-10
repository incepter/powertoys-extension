document.addEventListener('DOMContentLoaded', function() {
  let designModeEnabled = false;
  let highlighterEnabled = false;

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

  // Reveal hidden fields
  document.getElementById('reveal-hidden').addEventListener('click', function() {
    executeScript(() => {
      // Find elements with display:none or visibility:hidden
      const hiddenElements = [];

      // Function to process elements with computed style
      function processElements(selector, styleProperty, styleValue) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle[styleProperty] === styleValue) {
            // Store original style to be able to restore it if needed
            if (!element.dataset.originalStyle) {
              element.dataset.originalStyle = element.style[styleProperty];
            }
            // Make the element visible
            element.style[styleProperty] = styleProperty === 'display' ? 'block' : 'visible';
            hiddenElements.push(element);
          }
        });
      }

      // Process elements with display:none, excluding script and link tags
      processElements('*:not(script):not(link):not(style):not(title)', 'display', 'none');

      // Process elements with visibility:hidden, excluding script and link tags
      processElements('*:not(script):not(link):not(style):not(title)', 'visibility', 'hidden');

      // Add a subtle highlight to revealed elements
      hiddenElements.forEach(element => {
        element.style.outline = '2px dashed red';
      });

      return hiddenElements.length;
    }, (results) => {
      const count = results[0].result;
      showFeedback(`Revealed ${count} hidden element${count !== 1 ? 's' : ''}`);
    });
  });

  // Highlighter tool
  document.getElementById('highlighter').addEventListener('click', function() {
    highlighterEnabled = !highlighterEnabled;

    executeScript((enabled) => {
      // If we're disabling the highlighter, remove any existing highlighter functionality
      if (!enabled) {
        // Remove event listeners if they exist
        if (window._highlighterCleanup) {
          window._highlighterCleanup();
          delete window._highlighterCleanup;
        }
        return false;
      }

      // Create highlighter styles if they don't exist
      if (!document.getElementById('highlighter-styles')) {
        const style = document.createElement('style');
        style.id = 'highlighter-styles';
        style.textContent = `
          .powertoys-highlight {
            background-color: yellow !important;
            color: black !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Track if we're in highlighting mode
      let isHighlighting = false;

      // Function to handle mouse down
      function handleMouseDown(e) {
        // Only activate on left click
        if (e.button !== 0) return;

        isHighlighting = true;
        e.preventDefault();

        // Toggle highlight on the clicked element
        if (e.target.classList.contains('powertoys-highlight')) {
          e.target.classList.remove('powertoys-highlight');
        } else {
          e.target.classList.add('powertoys-highlight');
        }
      }

      // Function to handle mouse over while highlighting
      function handleMouseOver(e) {
        if (isHighlighting) {
          e.target.classList.add('powertoys-highlight');
        }
      }

      // Function to handle mouse up
      function handleMouseUp() {
        isHighlighting = false;
      }

      // Add event listeners
      document.addEventListener('mousedown', handleMouseDown, true);
      document.addEventListener('mouseover', handleMouseOver, true);
      document.addEventListener('mouseup', handleMouseUp, true);

      // Store cleanup function
      window._highlighterCleanup = function() {
        document.removeEventListener('mousedown', handleMouseDown, true);
        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('mouseup', handleMouseUp, true);

        // Remove all highlights
        document.querySelectorAll('.powertoys-highlight').forEach(el => {
          el.classList.remove('powertoys-highlight');
        });

        // Remove styles
        const styles = document.getElementById('highlighter-styles');
        if (styles) styles.remove();
      };

      return true;
    }, (results) => {
      const enabled = results[0].result;
      showFeedback(`Highlighter ${enabled ? 'enabled' : 'disabled'}`);
    }, highlighterEnabled);
  });

  // Export page as clean PDF
  document.getElementById('export-pdf').addEventListener('click', function() {
    executeScript(() => {
      // Create a clean version of the page for printing
      const originalBody = document.body.innerHTML;

      // Function to create a clean version of the page
      function createCleanPage() {
        // Clone the body to avoid modifying the original
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.body.innerHTML;

        // Remove common elements that are not needed in a PDF
        const selectorsToRemove = [
          'script', 'iframe', 'noscript', 'style', 'svg',
          'nav', 'header', 'footer', 'aside',
          '.ad', '.ads', '.advertisement', '.banner',
          '.cookie', '.popup', '.modal', '.overlay',
          '.social', '.share', '.comment', '.newsletter',
          '[class*="cookie"]', '[class*="popup"]', '[class*="modal"]',
          '[class*="overlay"]', '[class*="ad-"]', '[id*="ad-"]'
        ];

        selectorsToRemove.forEach(selector => {
          tempDiv.querySelectorAll(selector).forEach(el => {
            el.remove();
          });
        });

        // Return the cleaned HTML
        return tempDiv.innerHTML;
      }

      // Replace the body with a clean version
      document.body.innerHTML = createCleanPage();

      // Trigger the print dialog
      window.print();

      // Restore the original page after a short delay
      setTimeout(() => {
        document.body.innerHTML = originalBody;
      }, 1000);

      return true;
    }, (results) => {
      showFeedback('Preparing PDF export...');
    });
  });

  // Remove overlays, modals, and popups
  document.getElementById('remove-overlays').addEventListener('click', function() {
    executeScript(() => {
      let removedCount = 0;

      // Common selectors for overlays, modals, and popups
      const overlaySelectors = [
        // Common class names for overlays
        '.modal', '.overlay', '.popup', '.dialog', '.drawer',
        '.lightbox', '.toast', '.notification', '.alert',
        // Common ID patterns
        '#modal', '#overlay', '#popup', '#dialog',
        // Common class patterns
        '[class*="modal"]', '[class*="overlay"]', '[class*="popup"]',
        '[class*="dialog"]', '[class*="drawer"]', '[class*="lightbox"]',
        // Common ID patterns
        '[id*="modal"]', '[id*="overlay"]', '[id*="popup"]',
        '[id*="dialog"]', '[id*="drawer"]', '[id*="lightbox"]',
        // Fixed position elements that might be overlays
        'div[style*="position: fixed"]', 'div[style*="position:fixed"]'
      ];

      // Remove elements matching the selectors
      overlaySelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          // Check if it's likely an overlay (fixed position, high z-index, etc.)
          const style = window.getComputedStyle(element);
          const position = style.getPropertyValue('position');
          const zIndex = parseInt(style.getPropertyValue('z-index'), 10);

          // Only remove if it's likely an overlay
          if ((position === 'fixed' || position === 'absolute') &&
              (zIndex > 10 || isNaN(zIndex)) &&
              element.offsetWidth > 0 && element.offsetHeight > 0) {
            element.remove();
            removedCount++;
          }
        });
      });

      // Also remove body classes that might disable scrolling
      document.body.classList.forEach(className => {
        if (className.includes('modal-open') ||
            className.includes('no-scroll') ||
            className.includes('overflow-hidden')) {
          document.body.classList.remove(className);
        }
      });

      // Re-enable scrolling on body if it was disabled
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'auto';
      }

      return removedCount;
    }, (results) => {
      const count = results[0].result;
      showFeedback(`Removed ${count} overlay${count !== 1 ? 's' : ''}`);
    });
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
