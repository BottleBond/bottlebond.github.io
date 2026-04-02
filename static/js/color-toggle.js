(function() {
  var dots = document.querySelectorAll('.bb-color-dot');
  var activeGrade = localStorage.getItem('bb-color-grade') || null;

  // Apply saved state
  if (activeGrade) {
    dots.forEach(function(d) {
      if (d.getAttribute('data-grade') === activeGrade) d.classList.add('active');
    });
    document.body.setAttribute('data-grade', activeGrade);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var grade = dot.getAttribute('data-grade');
      var isActive = dot.classList.contains('active');

      dots.forEach(function(d) { d.classList.remove('active'); });

      if (isActive) {
        // Deselect — show all
        localStorage.removeItem('bb-color-grade');
        document.body.removeAttribute('data-grade');
      } else {
        dot.classList.add('active');
        localStorage.setItem('bb-color-grade', grade);
        document.body.setAttribute('data-grade', grade);
      }
    });
  });
})();
