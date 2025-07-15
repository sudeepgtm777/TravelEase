const Review = require('../models/reviewModel');
const factory = require('./handleFactory');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.submitReview = async (req, res, next) => {
  try {
    const { user, tour, review, rating } = req.body;

    // Check if user booked the tour
    const booking = await Booking.findOne({
      user,
      tour,
      paid: true,
    });

    if (!booking) {
      return next(
        new AppError(
          'You must purchase this tour before writing a review.',
          403,
        ),
      );
    }

    await Review.create({
      review,
      rating,
      tour,
      user,
    });

    res.redirect(`/tour/${tour}`);
  } catch (err) {
    return next(new AppError('The user has created the Review already!', 400));
  }
};

/****** The use of factory model to get the respective data. *******/
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
