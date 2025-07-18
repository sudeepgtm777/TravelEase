const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour.
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create the checkout session.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'Npr',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              'https://raw.githubusercontent.com/sudeepgtm777/TravelEase/refs/heads/main/public/img/payment.jpg',
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // It is unsecured So this is temporary as anyone can create booking without payment.
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price, paid: true });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.checkIfUserBooked = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  const booking = await Booking.findOne({
    user: req.user.id.toString(),
    tour: tourId.toString(),
    paid: true,
  });

  if (!booking) {
    return res.status(200).json({
      status: 'fail',
      message: 'You must purchase this tour before writing a review.',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'You have booked this tour.',
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
