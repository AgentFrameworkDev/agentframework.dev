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
   * Initialize all functionality when DOM is ready
   */
  function init() {
    setCurrentYear();
    randomizeInstructors();
    randomizeCommunityPartners();
    randomizePastSponsors();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
