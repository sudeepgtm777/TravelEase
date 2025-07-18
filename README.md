# TravelEase

# TravelEase Jaccard Similarity Recommendation System

## Overview

I have successfully implemented a **Jaccard Similarity-based recommendation system** for the TravelEase travel booking platform. This system provides personalized tour recommendations using two main approaches:

### 1. Content-Based Filtering

- Analyzes tour features (difficulty, duration, price, location, type)
- Compares with user's booking history to find similar tours
- Uses Jaccard Index to calculate similarity scores

### 2. Collaborative Filtering

- Finds users with similar booking patterns
- Recommends tours that similar users have booked
- Uses Jaccard Index to measure user similarity

## Implementation Details

### Core Components Created:

1. **`utils/jaccardRecommendation.js`** - Core recommendation algorithms
2. **`controllers/recommendationController.js`** - API endpoints for recommendations
3. **`routes/recommendationRoutes.js`** - Routes for recommendation APIs
4. **`views/recommendations.pug`** - Dedicated recommendations page
5. **`public/js/recommendations.js`** - Frontend JavaScript for recommendations
6. **CSS styles** - Styling for recommendation components

### API Endpoints:

- `GET /api/v1/recommendations` - Get user recommendations (JSON)
- `GET /api/v1/recommendations/stats` - Get user booking statistics
- `GET /recommendations` - Recommendations page (HTML)

### How Jaccard Similarity Works:

```javascript
// Jaccard Index = |A ∩ B| / |A ∪ B|
function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}
```

### Feature Extraction:

Tours are converted into feature sets based on:

- **Difficulty**: easy, medium, difficult
- **Duration**: short (≤3 days), medium (4-7 days), long (>7 days)
- **Group Size**: small (≤10), medium (11-20), large (>20)
- **Price Range**: budget (<1000), moderate (1000-3000), luxury (>3000)
- **Rating**: excellent (≥4.5), good (≥4.0), average (<4.0)
- **Location**: specific locations and regions
- **Tour Type**: adventure, cultural, nature, trekking, etc.

### User Interface:

1. **Navigation**: Added "Recommendations" link in header for logged-in users
2. **Overview Page**: Shows recommended tours for logged-in users
3. **Dedicated Page**: Full recommendations page with detailed explanations
4. **Visual Indicators**: Different badges for content-based, collaborative, and popular recommendations

### Sample Feature Sets:

**User A** (Adventure Lover):

- `difficulty:difficult`
- `type:adventure`
- `type:trekking`
- `duration:long`
- `price:moderate`

**User B** (Cultural Explorer):

- `difficulty:easy`
- `type:cultural`
- `type:heritage`
- `duration:short`
- `price:budget`

**Jaccard Similarity between A & B**: ~0% (very different preferences)

### Recommendation Logic:

1. **For New Users**: Show popular tours based on ratings
2. **For Users with Bookings**:
   - Extract preferences from booking history
   - Find tours with similar features (content-based)
   - Find similar users and recommend their tours (collaborative)
   - Combine and rank recommendations

### Integration Points:

- **Models**: Enhanced tour model with optional tags and tourType fields
- **Authentication**: All recommendation endpoints require login
- **Database**: Works with existing MongoDB collections
- **Frontend**: Seamlessly integrated with existing Pug templates

## Usage Examples:

### API Usage:

```javascript
// Get recommendations
const response = await fetch('/api/v1/recommendations', {
  headers: { Authorization: 'Bearer <token>' },
});
const data = await response.json();
```

### Frontend Integration:

```javascript
// Load recommendations on overview page
import { displayRecommendationsOnOverview } from './recommendations';
displayRecommendationsOnOverview();
```

## Benefits:

1. **Personalized Experience**: Users get tours matching their preferences
2. **Discovery**: Users find new tours similar to their interests
3. **Increased Bookings**: Relevant recommendations lead to more conversions
4. **User Engagement**: Keeps users engaged with personalized content
5. **Scalable**: Algorithm efficiently handles growing user and tour data

## Future Enhancements:

1. **Machine Learning**: Implement more sophisticated ML algorithms
2. **Real-time Updates**: Update recommendations based on user interactions
3. **A/B Testing**: Test different recommendation strategies
4. **Seasonal Recommendations**: Factor in seasonal preferences
5. **Social Features**: Include friend recommendations and social proof

The system is now fully integrated and ready to provide intelligent tour recommendations to TravelEase users!
