import axios from 'axios';
import { showAlert } from './alerts';

// Load user recommendations
export const loadRecommendations = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/recommendations',
    });

    if (res.data.status === 'success') {
      return res.data.data;
    }
  } catch (err) {
    console.log('Error loading recommendations:', err);
    if (err.response && err.response.data && err.response.data.message) {
      showAlert('error', err.response.data.message);
    }
    return null;
  }
};

// Display recommendations on overview page
export const displayRecommendationsOnOverview = async () => {
  const recommendationsContainer = document.querySelector(
    '.recommendations-section',
  );

  if (!recommendationsContainer) return;

  try {
    const data = await loadRecommendations();

    if (!data) return;

    // Clear existing content
    recommendationsContainer.innerHTML = '';

    // Create recommendations section
    const sectionHTML = `
      <div class="recommendations-overview">
        <h2 class="heading-secondary ma-bt-md">Recommended For You</h2>
        <div class="recommendations-preview">
          ${data.contentBased
            .slice(0, 3)
            .map((rec) => createRecommendationCard(rec))
            .join('')}
        </div>
        <div class="recommendations-cta">
          <a href="/recommendations" class="btn btn--green">View All Recommendations</a>
        </div>
      </div>
    `;

    recommendationsContainer.innerHTML = sectionHTML;
  } catch (err) {
    console.log('Error displaying recommendations:', err);
  }
};

// Create recommendation card HTML
const createRecommendationCard = (rec) => {
  return `
    <div class="card">
      <div class="card__header">
        <div class="card__picture">
          <div class="card__picture-overlay">&nbsp;</div>
          <img class="card__picture-img" src="/img/tours/${
            rec.tour.imageCover
          }" alt="${rec.tour.name}">
        </div>
        <h3 class="heading-tertiary">
          <span>${rec.tour.name}</span>
        </h3>
      </div>

      <div class="card__details">
        <h4 class="card__sub-heading">${rec.tour.difficulty} ${
          rec.tour.duration
        }-day tour</h4>
        <p class="card__text">${rec.tour.summary}</p>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="/img/icons.svg#icon-map-pin"></use>
          </svg>
          <span>${rec.tour.startLocation.description}</span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="/img/icons.svg#icon-calendar"></use>
          </svg>
          <span>${new Date(rec.tour.startDates[0]).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}</span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="/img/icons.svg#icon-flag"></use>
          </svg>
          <span>${rec.tour.locations.length} stops</span>
        </div>
        <div class="card__data">
          <svg class="card__icon">
            <use xlink:href="/img/icons.svg#icon-user"></use>
          </svg>
          <span>${rec.tour.maxGroupSize} people</span>
        </div>
      </div>

      <div class="card__footer">
        <p>
          <span class="card__footer-value">Rs ${rec.tour.price}</span>
          <span class="card__footer-text">per person</span>
        </p>
        <p class="card__ratings">
          <span class="card__footer-value">${rec.tour.ratingsAverage}</span>
          <span class="card__footer-text">rating (${
            rec.tour.ratingsQuantity
          })</span>
        </p>
        <div class="recommendation-badge recommendation-badge--small">
          ${Math.round(rec.similarity * 100)}% match
        </div>
        <a class="btn btn--green btn--small" href="/tour/${
          rec.tour.slug
        }">Details</a>
      </div>
    </div>
  `;
};

// Get user booking statistics
export const loadUserStats = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/recommendations/stats',
    });

    if (res.data.status === 'success') {
      return res.data.data;
    }
  } catch (err) {
    console.log('Error loading user stats:', err);
    return null;
  }
};
