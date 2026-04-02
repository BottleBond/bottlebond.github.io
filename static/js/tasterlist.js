/* BottleBond Taster List — Client-side filtering */
(function() {
  'use strict';

  var data = window.bbTasterList || [];
  var cards = document.querySelectorAll('.bottle-card');
  var grid = document.getElementById('tl-grid');
  var empty = document.getElementById('tl-empty');

  // Populate dynamic filter options
  var hosts = [];
  var distilleries = [];
  data.forEach(function(b) {
    b.scores.forEach(function(s) {
      if (hosts.indexOf(s.host) === -1) hosts.push(s.host);
    });
    if (distilleries.indexOf(b.distillery) === -1) distilleries.push(b.distillery);
  });

  var hostSelect = document.getElementById('tl-host-filter');
  hosts.sort().forEach(function(h) {
    var opt = document.createElement('option');
    opt.value = h;
    opt.textContent = h;
    hostSelect.appendChild(opt);
  });

  var distSelect = document.getElementById('tl-distillery-filter');
  distilleries.sort().forEach(function(d) {
    var opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    distSelect.appendChild(opt);
  });

  // State
  var activeGrade = 'all';
  var activeHost = 'all';
  var activeDistillery = 'all';
  var activePrice = 'all';
  var searchText = '';

  // Grade filter buttons
  document.querySelectorAll('.grade-filter').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.grade-filter').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeGrade = btn.getAttribute('data-grade');
      applyFilters();
      if (window.bbTrack) bbTrack('filter_use', { filterType: 'grade', filterValue: activeGrade });
    });
  });

  // Dropdown filters
  hostSelect.addEventListener('change', function() {
    activeHost = this.value;
    applyFilters();
    if (window.bbTrack) bbTrack('filter_use', { filterType: 'host', filterValue: activeHost });
  });

  distSelect.addEventListener('change', function() {
    activeDistillery = this.value;
    applyFilters();
    if (window.bbTrack) bbTrack('filter_use', { filterType: 'distillery', filterValue: activeDistillery });
  });

  document.getElementById('tl-price-filter').addEventListener('change', function() {
    activePrice = this.value;
    applyFilters();
    if (window.bbTrack) bbTrack('filter_use', { filterType: 'price', filterValue: activePrice });
  });

  // Search
  var searchInput = document.getElementById('tl-search');
  var searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      searchText = searchInput.value.toLowerCase().trim();
      applyFilters();
    }, 200);
  });

  function applyFilters() {
    var visible = 0;
    cards.forEach(function(card) {
      var show = true;

      // Grade filter
      if (activeGrade !== 'all') {
        var grades = (card.getAttribute('data-grades') || '').trim().split(/\s+/);
        if (activeHost !== 'all') {
          // Filter by specific host's grade
          var bottleId = card.getAttribute('data-id');
          var bottle = data.find(function(b) { return b.id === bottleId; });
          if (bottle) {
            var hostScore = bottle.scores.find(function(s) { return s.host === activeHost; });
            if (!hostScore || hostScore.grade !== activeGrade) show = false;
          }
        } else {
          if (grades.indexOf(activeGrade) === -1) show = false;
        }
      }

      // Host filter (when no grade is selected)
      if (activeHost !== 'all' && activeGrade === 'all') {
        var hostList = (card.getAttribute('data-hosts') || '').trim().split(/\s+/);
        if (hostList.indexOf(activeHost) === -1) show = false;
      }

      // Distillery filter
      if (activeDistillery !== 'all') {
        if (card.getAttribute('data-distillery') !== activeDistillery) show = false;
      }

      // Price filter
      if (activePrice !== 'all') {
        var price = parseInt(card.getAttribute('data-price'), 10);
        var range = activePrice.split('-');
        if (price < parseInt(range[0], 10) || price >= parseInt(range[1], 10)) show = false;
      }

      // Search filter
      if (searchText) {
        var haystack = card.getAttribute('data-search') || '';
        if (haystack.indexOf(searchText) === -1) show = false;
      }

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    empty.style.display = visible === 0 ? 'block' : 'none';
  }
})();
