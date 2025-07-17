const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import models
const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Booking = require('./models/bookingModel');

// Import recommendation utilities
const {
  jaccardSimilarity,
  recommendToursByContent,
  getCollaborativeRecommendations,
  extractTourFeatures,
  getUserPreferences
} = require('./utils/jaccardRecommendation');

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connection successful!'));

// Test functions
async function testJaccardSimilarity() {
  console.log('\n🧪 Testing Jaccard Similarity Algorithm\n');
  
  // Example sets for testing
  const userA = new Set(['adventure', 'trekking', 'mountains', 'difficult']);
  const userB = new Set(['adventure', 'trekking', 'nature', 'medium']);
  const userC = new Set(['cultural', 'heritage', 'temples', 'easy']);
  
  console.log('User A preferences:', Array.from(userA));
  console.log('User B preferences:', Array.from(userB));
  console.log('User C preferences:', Array.from(userC));
  
  const similarityAB = jaccardSimilarity(userA, userB);
  const similarityAC = jaccardSimilarity(userA, userC);
  const similarityBC = jaccardSimilarity(userB, userC);
  
  console.log(`\n📊 Similarity Results:`);
  console.log(`User A ↔ User B: ${(similarityAB * 100).toFixed(1)}%`);
  console.log(`User A ↔ User C: ${(similarityAC * 100).toFixed(1)}%`);
  console.log(`User B ↔ User C: ${(similarityBC * 100).toFixed(1)}%`);
}

async function testTourFeatureExtraction() {
  console.log('\n🏔️ Testing Tour Feature Extraction\n');
  
  try {
    // Get a sample tour
    const tour = await Tour.findOne();
    if (!tour) {
      console.log('❌ No tours found in database');
      return;
    }
    
    console.log(`Tour: ${tour.name}`);
    console.log(`Difficulty: ${tour.difficulty}`);
    console.log(`Duration: ${tour.duration} days`);
    console.log(`Price: Rs ${tour.price}`);
    console.log(`Max Group Size: ${tour.maxGroupSize}`);
    console.log(`Rating: ${tour.ratingsAverage}`);
    
    const features = extractTourFeatures(tour);
    console.log('\n🏷️ Extracted Features:');
    Array.from(features).forEach(feature => console.log(`  • ${feature}`));
    
  } catch (error) {
    console.log('❌ Error testing tour features:', error.message);
  }
}

async function testUserRecommendations() {
  console.log('\n👤 Testing User Recommendations\n');
  
  try {
    // Get a user who has bookings
    const userWithBookings = await User.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'user',
          as: 'bookings'
        }
      },
      {
        $match: {
          'bookings.0': { $exists: true }
        }
      },
      {
        $limit: 1
      }
    ]);
    
    if (userWithBookings.length === 0) {
      console.log('❌ No users with bookings found');
      return;
    }
    
    const user = userWithBookings[0];
    console.log(`Testing recommendations for: ${user.name}`);
    
    // Get user preferences
    const preferences = await getUserPreferences(user._id);
    console.log('\n🎯 User Preferences:');
    Array.from(preferences).forEach(pref => console.log(`  • ${pref}`));
    
    // Get content-based recommendations
    const contentRecs = await recommendToursByContent(user._id, 3);
    console.log('\n📋 Content-based Recommendations:');
    contentRecs.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec.tour.name}`);
      console.log(`     Match: ${(rec.similarity * 100).toFixed(1)}%`);
      console.log(`     Reason: ${rec.reason}`);
    });
    
    // Get collaborative recommendations
    const collabRecs = await getCollaborativeRecommendations(user._id, 3);
    console.log('\n🤝 Collaborative Recommendations:');
    if (collabRecs.length > 0) {
      collabRecs.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec.tour.name}`);
        console.log(`     User Similarity: ${(rec.similarity * 100).toFixed(1)}%`);
        console.log(`     Reason: ${rec.reason}`);
      });
    } else {
      console.log('  No collaborative recommendations available');
    }
    
  } catch (error) {
    console.log('❌ Error testing recommendations:', error.message);
  }
}

async function runTests() {
  console.log('🚀 TravelEase Jaccard Similarity Recommendation System Test\n');
  console.log('=' * 60);
  
  await testJaccardSimilarity();
  await testTourFeatureExtraction();
  await testUserRecommendations();
  
  console.log('\n✅ Tests completed!');
  console.log('\n📝 Summary:');
  console.log('- Jaccard similarity algorithm calculates similarity between user preferences');
  console.log('- Content-based filtering recommends tours based on feature matching');
  console.log('- Collaborative filtering finds similar users and recommends their tours');
  console.log('- Features are extracted from tour attributes like difficulty, price, location');
  
  process.exit(0);
}

// Run tests
runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
