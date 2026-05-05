/**
 * AgentFramework.dev - Main JavaScript
 */

(function () {
  'use strict';

  /**
   * Set the current year in the copyright notice
   */
  function setCurrentYear() {
    var yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array - The array to shuffle
   * @returns {Array} - The shuffled array
   */
  function shuffleArray(array) {
    var shuffled = array.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  /**
   * Randomize the order of an element's direct children
   * @param {string} elementId - The id of the element to randomize
   */
  function randomizeElementChildren(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    var items = Array.prototype.slice.call(element.children);
    var shuffled = shuffleArray(items);

    shuffled.forEach(function (item) {
      element.appendChild(item);
    });
  }

  /**
   * Randomize the order of instructor list items
   */
  function randomizeInstructors() {
    randomizeElementChildren('instructor-list');
  }

  /**
   * Randomize the order of community partner cards
   */
  function randomizeCommunityPartners() {
    randomizeElementChildren('community-partners-grid');
  }

  /**
   * Randomize the order of past sponsor cards
   */
  function randomizePastSponsors() {
    randomizeElementChildren('past-sponsors-grid');
  }

  /**
   * Open the memory event matching the current URL hash and scroll to it.
   */
  function revealMemoryFromHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) {
      return;
    }
    var id = hash.slice(1);
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('memory-event')) {
      return;
    }
    target.open = true;
    // Defer scroll so layout settles after opening <details>.
    window.requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /**
   * Copy text to the clipboard. Falls back to a hidden textarea when the
   * async Clipboard API is unavailable (e.g. non-secure contexts).
   */
  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          resolve();
        } else {
          reject(new Error('execCommand copy failed'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Wire up "Copy link to this memory" chips and hash-based deep linking.
   */
  function setupMemoryPermalinks() {
    var chips = document.querySelectorAll('.memory-link-chip[data-memory-target]');
    Array.prototype.forEach.call(chips, function (chip) {
      var labelEl = chip.querySelector('.memory-link-chip__label');
      var defaultLabel = labelEl ? labelEl.textContent : '';

      chip.addEventListener('click', function (event) {
        event.preventDefault();
        var id = chip.getAttribute('data-memory-target');
        if (!id) {
          return;
        }
        var url = window.location.origin + window.location.pathname + '#' + id;
        copyTextToClipboard(url).then(function () {
          if (labelEl) {
            labelEl.textContent = 'Link copied';
          }
          chip.classList.add('is-copied');
          window.setTimeout(function () {
            chip.classList.remove('is-copied');
            if (labelEl) {
              labelEl.textContent = defaultLabel;
            }
          }, 1600);
        }).catch(function () {
          if (labelEl) {
            labelEl.textContent = 'Press Ctrl+C';
          }
          window.setTimeout(function () {
            if (labelEl) {
              labelEl.textContent = defaultLabel;
            }
          }, 1600);
        });
        // Update the address bar so the link is shareable from here too.
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + id);
        }
      });
    });

    revealMemoryFromHash();
    window.addEventListener('hashchange', revealMemoryFromHash);
  }

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    setCurrentYear();
    randomizeInstructors();
    randomizeCommunityPartners();
    randomizePastSponsors();
    setupMemoryPermalinks();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
