const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Calculate Jaccard similarity between two sets
function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Get user's booked tour IDs
async function getUserBookedTours(userId) {
  // Use aggregation to bypass population middleware and get raw tour IDs
  const bookings = await Booking.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $project: { tour: 1, _id: 0 } },
  ]);

  const tourIds = bookings.map((booking) => booking.tour.toString());
  return new Set(tourIds);
}

// Find similar users based on booking history
async function findSimilarUsers(targetUserId, threshold = 0.1) {
  const targetUserTours = await getUserBookedTours(targetUserId);

  // Return empty array if user has no bookings
  if (targetUserTours.size === 0) {
    return [];
  }

  const allUsers = await User.find({ _id: { $ne: targetUserId } });

  const similarUsers = [];

  for (const user of allUsers) {
    const userTours = await getUserBookedTours(user._id);

    // Skip users with no bookings
    if (userTours.size === 0) continue;

    const similarity = jaccardSimilarity(targetUserTours, userTours);

    if (similarity >= threshold) {
      similarUsers.push({ userId: user._id, similarity });
    }
  }

  return similarUsers.sort((a, b) => b.similarity - a.similarity);
}

// Extract features from tour for content-based filtering
function extractTourFeatures(tour) {
  const features = new Set();

  // Add tour attributes as features
  if (tour.difficulty) features.add(`difficulty:${tour.difficulty}`);
  if (tour.duration) {
    // Group duration into categories
    if (tour.duration <= 3) features.add('duration:short');
    else if (tour.duration <= 7) features.add('duration:medium');
    else features.add('duration:long');
  }

  // Group size preferences
  if (tour.maxGroupSize <= 10) features.add('group:small');
  else if (tour.maxGroupSize <= 20) features.add('group:medium');
  else features.add('group:large');

  // Price categories
  if (tour.price < 1000) features.add('price:budget');
  else if (tour.price < 3000) features.add('price:moderate');
  else features.add('price:luxury');

  // Rating categories
  if (tour.ratingsAverage >= 4.5) features.add('rating:excellent');
  else if (tour.ratingsAverage >= 4.0) features.add('rating:good');
  else features.add('rating:average');

  // Location-based features
  if (tour.startLocation && tour.startLocation.description) {
    const location = tour.startLocation.description.toLowerCase();
    features.add(`location:${location}`);

    // Extract location keywords
    const locationKeywords = [
      'kathmandu',
      'pokhara',
      'chitwan',
      'lumbini',
      'everest',
      'annapurna',
    ];
    locationKeywords.forEach((keyword) => {
      if (location.includes(keyword)) {
        features.add(`region:${keyword}`);
      }
    });
  }

  // Tour type/category based on summary and name
  if (tour.summary || tour.name) {
    const content = `${tour.summary || ''} ${tour.name || ''}`.toLowerCase();
    const tourTypes = [
      'trek',
      'trekking',
      'hiking',
      'adventure',
      'cultural',
      'heritage',
      'nature',
      'wildlife',
      'safari',
      'temple',
      'monastery',
      'spiritual',
      'mountain',
      'hill',
      'lake',
      'national park',
      'jungle',
    ];

    tourTypes.forEach((type) => {
      if (content.includes(type)) {
        features.add(`type:${type}`);
      }
    });
  }

  return features;
}

// Get user preferences based on their booking history
async function getUserPreferences(userId) {
  const bookedTourIds = await getUserBookedTours(userId);

  const preferences = new Set();

  for (const tourId of bookedTourIds) {
    // Ensure tourId is a string
    const cleanTourId =
      typeof tourId === 'object'
        ? tourId._id || tourId.toString()
        : tourId.toString();
    const tour = await Tour.findById(cleanTourId);
    if (tour) {
      const features = extractTourFeatures(tour);
      features.forEach((feature) => preferences.add(feature));
    }
  }

  return preferences;
}

// Recommend tours based on content similarity
async function recommendToursByContent(userId, limit = 10) {
  const userPreferences = await getUserPreferences(userId);

  // If user has no preferences, return popular tours
  if (userPreferences.size === 0) {
    const popularTours = await Tour.find()
      .sort({ ratingsAverage: -1, ratingsQuantity: -1 })
      .limit(limit);

    return popularTours.map((tour) => ({
      tour,
      similarity: 0,
      reason: 'Popular tour',
    }));
  }

  const bookedTours = await getUserBookedTours(userId);

  // Get all tours except already booked ones
  const availableTours = await Tour.find({
    _id: { $nin: Array.from(bookedTours) },
  });

  const recommendations = [];

  for (const tour of availableTours) {
    const tourFeatures = extractTourFeatures(tour);
    const similarity = jaccardSimilarity(userPreferences, tourFeatures);

    if (similarity > 0) {
      recommendations.push({
        tour,
        similarity,
        reason: `${Math.round(similarity * 100)}% match with your preferences`,
      });
    }
  }

  return recommendations
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Get collaborative recommendations
async function getCollaborativeRecommendations(userId, limit = 5) {
  const similarUsers = await findSimilarUsers(userId, 0.1);
  const userBookedTours = await getUserBookedTours(userId);
  const collaborativeRecommendations = [];

  if (similarUsers.length > 0) {
    // Get tours booked by similar users
    for (const similarUser of similarUsers.slice(0, 3)) {
      const similarUserTours = await getUserBookedTours(similarUser.userId);
      const recommendedTourIds = [...similarUserTours].filter(
        (tourId) => !userBookedTours.has(tourId),
      );

      for (const tourId of recommendedTourIds.slice(0, 2)) {
        // Ensure tourId is a string
        const cleanTourId =
          typeof tourId === 'object'
            ? tourId._id || tourId.toString()
            : tourId.toString();
        const tour = await Tour.findById(cleanTourId);
        if (tour) {
          collaborativeRecommendations.push({
            tour,
            similarity: similarUser.similarity,
            reason: `Users with similar taste also booked this (${Math.round(
              similarUser.similarity * 100,
            )}% similarity)`,
          });
        }
      }
    }
  }

  return collaborativeRecommendations
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

module.exports = {
  jaccardSimilarity,
  getUserBookedTours,
  findSimilarUsers,
  extractTourFeatures,
  getUserPreferences,
  recommendToursByContent,
  getCollaborativeRecommendations,
};
