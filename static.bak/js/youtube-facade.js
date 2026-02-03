/**
 * YouTube Facade - Lightweight YouTube embed with privacy-enhanced mode
 *
 * This script provides click-to-play YouTube embeds that:
 * 1. Load only a thumbnail initially (no YouTube scripts)
 * 2. Use youtube-nocookie.com for privacy
 * 3. Load the iframe only when the user clicks play
 */

(function() {
  'use strict';

  // Initialize all YouTube embeds on the page
  function initYouTubeEmbeds() {
    const embeds = document.querySelectorAll('.youtube-embed[data-video-id]');

    embeds.forEach(function(embed) {
      const videoId = embed.dataset.videoId;
      if (!videoId) return;

      const playBtn = embed.querySelector('.youtube-play-btn');
      const thumbnail = embed.querySelector('.youtube-thumbnail');

      if (playBtn) {
        playBtn.addEventListener('click', function(e) {
          e.preventDefault();
          loadVideo(embed, videoId);
        });
      }

      if (thumbnail) {
        thumbnail.addEventListener('click', function(e) {
          e.preventDefault();
          loadVideo(embed, videoId);
        });
      }
    });
  }

  // Load the YouTube iframe
  function loadVideo(container, videoId) {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
    iframe.className = 'youtube-iframe';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('title', 'YouTube video player');

    // Remove thumbnail and play button, add iframe
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouTubeEmbeds);
  } else {
    initYouTubeEmbeds();
  }
})();
