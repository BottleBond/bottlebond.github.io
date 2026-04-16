/**
 * Featured Episode Randomization
 * Selects a random episode from the episodes data and displays it on the homepage
 */

(function() {
  'use strict';

  // Episodes data embedded at build time (populated via Hugo template)
  // This script works with the episodes-featured shortcode

  const featuredContainer = document.getElementById('featured-episode');
  if (!featuredContainer) return;

  // Get episodes from data attribute
  const episodesData = featuredContainer.dataset.episodes;
  if (!episodesData) return;

  // Get Buzzsprout data (map of youtubeId -> listenUrl)
  let buzzsproutMap = {};
  try {
    buzzsproutMap = JSON.parse(featuredContainer.dataset.buzzsprout || '{}');
  } catch (_) { /* ignore */ }

  try {
    const episodes = JSON.parse(episodesData);
    if (!episodes || episodes.length === 0) return;

    // Select random episode
    const randomIndex = Math.floor(Math.random() * episodes.length);
    const episode = episodes[randomIndex];

    // Build episode card HTML
    const html = `
      <div class="featured-episode-card" style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
        <div class="row">
          <div class="col-md-7">
            <div class="youtube-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
              <iframe
                src="https://www.youtube-nocookie.com/embed/${episode.youtubeId}?rel=0"
                title="${episode.title}"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div class="col-md-5">
            <div class="featured-info" style="padding: 30px; color: #fff;">
              <span class="featured-label" style="display: inline-block; background: #D4AF37; color: #2c2c2c; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">Featured Episode</span>
              <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 24px; line-height: 1.3;">${episode.title}</h3>
              <p style="margin: 0 0 20px 0; color: #ccc; line-height: 1.6;">${episode.description}</p>
              <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                <span style="color: #D4AF37;"><i class="fas fa-clock"></i> ${episode.duration}</span>
                <a href="https://www.youtube.com/watch?v=${episode.youtubeId}" target="_blank" rel="noopener" class="btn btn-primary" style="background: #D4AF37; border-color: #D4AF37; color: #2c2c2c;">
                  <i class="fas fa-external-link-alt"></i> Watch on YouTube
                </a>
                ${buzzsproutMap[episode.youtubeId] ? `<a href="${buzzsproutMap[episode.youtubeId]}" target="_blank" rel="noopener" class="buzzsprout-badge"><i class="fas fa-podcast"></i> Listen</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    featuredContainer.innerHTML = html;

  } catch (e) {
    console.error('Error loading featured episode:', e);
  }
})();
