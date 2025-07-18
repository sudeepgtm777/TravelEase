const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const {
  recommendToursByContent,
  getCollaborativeRecommendations,
  getUserBookedTours,
} = require('../utils/jaccardRecommendation');

// Get API recommendations
exports.getRecommendations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Get content-based recommendations
  const contentRecommendations = await recommendToursByContent(userId, 6);

  // Get collaborative filtering recommendations
  const collaborativeRecommendations = await getCollaborativeRecommendations(
    userId,
    4,
  );

  // Get popular tours as fallback
  const popularTours = await Tour.find()
    .sort({ ratingsAverage: -1, ratingsQuantity: -1 })
    .limit(4);

  const popularRecommendations = popularTours.map((tour) => ({
    tour,
    similarity: 0,
    reason: 'Popular among travelers',
  }));

  res.status(200).json({
    status: 'success',
    data: {
      contentBased: contentRecommendations,
      collaborative: collaborativeRecommendations,
      popular: popularRecommendations,
      totalRecommendations:
        contentRecommendations.length + collaborativeRecommendations.length,
    },
  });
});

// Get recommendations page
exports.getRecommendationsPage = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError('You must be logged in to view recommendations', 401),
    );
  }

  const userId = req.user.id;

  // Get content-based recommendations
  const contentRecommendations = await recommendToursByContent(userId, 6);

  // Get collaborative recommendations
  const collaborativeRecommendations = await getCollaborativeRecommendations(
    userId,
    4,
  );

  // Get user's booking history for display
  const userBookedTours = await getUserBookedTours(userId);
  const bookingHistory = await Tour.find({
    _id: { $in: Array.from(userBookedTours) },
  });

  // Combine all recommendations
  const allRecommendations = [
    ...contentRecommendations.map((r) => ({ ...r, type: 'content' })),
    ...collaborativeRecommendations.map((r) => ({
      ...r,
      type: 'collaborative',
    })),
  ];

  // If no personalized recommendations, show popular tours
  if (allRecommendations.length === 0) {
    const popularTours = await Tour.find()
      .sort({ ratingsAverage: -1, ratingsQuantity: -1 })
      .limit(8);

    allRecommendations.push(
      ...popularTours.map((tour) => ({
        tour,
        similarity: 0,
        reason: 'Popular among travelers',
        type: 'popular',
      })),
    );
  }

  res.status(200).render('recommendations', {
    title: 'Recommended Tours',
    recommendations: allRecommendations,
    bookingHistory,
    hasBookingHistory: bookingHistory.length > 0,
    user: req.user,
  });
});

// Get user's booking statistics
exports.getUserBookingStats = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const userBookedTours = await getUserBookedTours(userId);
  const bookingHistory = await Tour.find({
    _id: { $in: Array.from(userBookedTours) },
  });

  // Calculate user preferences statistics
  const difficultyStats = {};
  const priceRangeStats = {};
  const durationStats = {};

  bookingHistory.forEach((tour) => {
    // Difficulty preferences
    difficultyStats[tour.difficulty] =
      (difficultyStats[tour.difficulty] || 0) + 1;

    // Price range preferences
    let priceRange;
    if (tour.price < 1000) priceRange = 'Budget';
    else if (tour.price < 3000) priceRange = 'Moderate';
    else priceRange = 'Luxury';
    priceRangeStats[priceRange] = (priceRangeStats[priceRange] || 0) + 1;

    // Duration preferences
    let durationRange;
    if (tour.duration <= 3) durationRange = 'Short';
    else if (tour.duration <= 7) durationRange = 'Medium';
    else durationRange = 'Long';
    durationStats[durationRange] = (durationStats[durationRange] || 0) + 1;
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalBookings: bookingHistory.length,
      preferences: {
        difficulty: difficultyStats,
        priceRange: priceRangeStats,
        duration: durationStats,
      },
      recentBookings: bookingHistory.slice(-3),
    },
  });
});

module.exports = {
  getRecommendations: exports.getRecommendations,
  getRecommendationsPage: exports.getRecommendationsPage,
  getUserBookingStats: exports.getUserBookingStats,
};
