/**
 * BottleBond — Find Your Bourbon Quiz Engine
 *
 * Reads quiz data from window.bbQuizData, steps through questions
 * one at a time with fade transitions, tallies grade counts, and
 * redirects to the matching result page on completion.
 */

(function () {
  'use strict';

  // Lightweight analytics stub — replace with real implementation when ready
  function bbTrack(event, data) {
    if (window.bbTrack && typeof window.bbTrack === 'function') {
      window.bbTrack(event, data);
    }
  }

  var quizData = window.bbQuizData;
  if (!quizData || !quizData.questions) return;

  var questions = quizData.questions;
  var totalQuestions = questions.length;
  var currentIndex = 0;
  var answers = {}; // { questionId: grade }
  var hasStarted = false;

  var questionArea = document.getElementById('quiz-question-area');
  var progressBar = document.getElementById('quiz-progress-bar');
  var progressLabel = document.getElementById('quiz-progress-label');

  if (!questionArea) return;

  // --- DOM helpers (safe, no innerHTML) ---

  function createElement(tag, attrs, textContent) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          if (key === 'className') {
            el.className = attrs[key];
          } else {
            el.setAttribute(key, attrs[key]);
          }
        }
      }
    }
    if (textContent !== undefined) {
      el.textContent = textContent;
    }
    return el;
  }

  function clearElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  // --- Render ---

  function renderQuestion(index) {
    var q = questions[index];
    if (!q) return;

    clearElement(questionArea);

    // Wrapper with fade
    var wrapper = createElement('div', {
      className: 'quiz-question',
      style: 'opacity: 0; transition: opacity 0.35s ease;'
    });

    // Question text
    var heading = createElement('h2', { className: 'quiz-question-text' }, q.text);
    wrapper.appendChild(heading);

    // Answers container
    var answersDiv = createElement('div', { className: 'quiz-answers' });

    for (var i = 0; i < q.answers.length; i++) {
      var a = q.answers[i];
      var btn = createElement('button', {
        className: 'quiz-answer',
        'data-grade': a.grade
      }, a.text);
      btn.addEventListener('click', handleAnswer);
      answersDiv.appendChild(btn);
    }

    wrapper.appendChild(answersDiv);
    questionArea.appendChild(wrapper);

    // Trigger fade-in on next frame
    requestAnimationFrame(function () {
      wrapper.style.opacity = '1';
    });

    updateProgress(index);
  }

  function handleAnswer(e) {
    var btn = e.currentTarget;
    var grade = btn.getAttribute('data-grade');
    var q = questions[currentIndex];

    // Track first answer
    if (!hasStarted) {
      hasStarted = true;
      bbTrack('quiz_start');
    }

    // Mark selected
    var siblings = questionArea.querySelectorAll('.quiz-answer');
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].classList.remove('selected');
      siblings[i].disabled = true;
    }
    btn.classList.add('selected');

    // Record answer
    answers[q.id] = grade;

    // Short pause, then advance
    setTimeout(function () {
      currentIndex++;
      if (currentIndex < totalQuestions) {
        fadeOutThenRender(currentIndex);
      } else {
        finishQuiz();
      }
    }, 400);
  }

  function fadeOutThenRender(nextIndex) {
    var el = questionArea.querySelector('.quiz-question');
    if (el) {
      el.style.opacity = '0';
      setTimeout(function () {
        renderQuestion(nextIndex);
      }, 350);
    } else {
      renderQuestion(nextIndex);
    }
  }

  function updateProgress(index) {
    var pct = ((index) / totalQuestions) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = 'Question ' + (index + 1) + ' of ' + totalQuestions;
  }

  function finishQuiz() {
    // Tally grades
    var tally = { green: 0, blue: 0, black: 0, red: 0 };
    for (var key in answers) {
      if (answers.hasOwnProperty(key)) {
        var g = answers[key];
        if (tally.hasOwnProperty(g)) {
          tally[g]++;
        }
      }
    }

    // Find dominant grade
    var dominant = 'green';
    var maxCount = 0;
    for (var grade in tally) {
      if (tally.hasOwnProperty(grade) && tally[grade] > maxCount) {
        maxCount = tally[grade];
        dominant = grade;
      }
    }

    // Fill progress bar
    if (progressBar) progressBar.style.width = '100%';
    if (progressLabel) progressLabel.textContent = 'Complete!';

    bbTrack('quiz_complete', { grade: dominant });

    // Redirect to result page
    setTimeout(function () {
      window.location.href = '/quiz/result/' + dominant + '/';
    }, 600);
  }

  // --- Init ---
  renderQuestion(0);

})();
