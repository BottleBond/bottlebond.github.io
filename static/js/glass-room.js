/* ============================================================
   Glass Room — Tab Filtering & Analytics
   ============================================================ */

(function () {
  'use strict';

  var tabs = document.querySelectorAll('.glass-room-tab');
  var items = document.querySelectorAll('.glass-room-feed-item');

  if (!tabs.length || !items.length) return;

  /**
   * Filter feed items by content type.
   * @param {string} filter — "all" or a content_type value (era, guide, glossary, how-to)
   */
  function filterItems(filter) {
    items.forEach(function (item) {
      if (filter === 'all' || item.getAttribute('data-content-type') === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  /**
   * Set the active tab and update ARIA attributes.
   * @param {Element} activeTab
   */
  function setActiveTab(activeTab) {
    tabs.forEach(function (tab) {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
  }

  // Bind click handlers
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      setActiveTab(this);
      filterItems(filter);

      // Analytics tracking
      if (typeof bbTrack === 'function') {
        bbTrack('glass_room_tab', { tab: filter });
      }
    });
  });

  // Support keyboard navigation between tabs
  var tabList = document.querySelector('.glass-room-tabs');
  if (tabList) {
    tabList.addEventListener('keydown', function (e) {
      var currentTab = document.querySelector('.glass-room-tab.active');
      var tabsArray = Array.prototype.slice.call(tabs);
      var index = tabsArray.indexOf(currentTab);
      var newIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabsArray.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabsArray.length) % tabsArray.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabsArray.length - 1;
      }

      if (newIndex >= 0) {
        tabsArray[newIndex].focus();
        tabsArray[newIndex].click();
      }
    });
  }
})();
