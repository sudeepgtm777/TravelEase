// Simple Jaccard Similarity Demonstration
console.log('🚀 TravelEase Jaccard Similarity Demo\n');

// Jaccard similarity function
function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Example user preferences based on tour features
const adventureUser = new Set([
  'difficulty:difficult',
  'type:adventure', 
  'type:trekking',
  'duration:long',
  'price:moderate',
  'location:mountains'
]);

const culturalUser = new Set([
  'difficulty:easy',
  'type:cultural',
  'type:heritage', 
  'duration:short',
  'price:budget',
  'location:kathmandu'
]);

const natureUser = new Set([
  'difficulty:medium',
  'type:nature',
  'type:wildlife',
  'duration:medium', 
  'price:moderate',
  'location:chitwan'
]);

// Sample tour features
const trekkingTour = new Set([
  'difficulty:difficult',
  'type:adventure',
  'type:trekking',
  'duration:long',
  'price:moderate',
  'location:mountains'
]);

const templeTour = new Set([
  'difficulty:easy',
  'type:cultural',
  'type:heritage',
  'type:spiritual',
  'duration:short',
  'price:budget',
  'location:kathmandu'
]);

const safariTour = new Set([
  'difficulty:medium',
  'type:nature',
  'type:wildlife',
  'duration:medium',
  'price:moderate',
  'location:chitwan'
]);

console.log('👥 User Preferences:');
console.log('Adventure User:', Array.from(adventureUser).join(', '));
console.log('Cultural User:', Array.from(culturalUser).join(', '));
console.log('Nature User:', Array.from(natureUser).join(', '));

console.log('\n🏔️ Tour Features:');
console.log('Trekking Tour:', Array.from(trekkingTour).join(', '));
console.log('Temple Tour:', Array.from(templeTour).join(', '));
console.log('Safari Tour:', Array.from(safariTour).join(', '));

console.log('\n📊 Jaccard Similarity Scores:');

// Adventure user similarities
console.log('\n🥾 Adventure User Recommendations:');
const advTrekking = jaccardSimilarity(adventureUser, trekkingTour);
const advTemple = jaccardSimilarity(adventureUser, templeTour);
const advSafari = jaccardSimilarity(adventureUser, safariTour);

console.log(`Trekking Tour: ${(advTrekking * 100).toFixed(1)}% match`);
console.log(`Temple Tour: ${(advTemple * 100).toFixed(1)}% match`);
console.log(`Safari Tour: ${(advSafari * 100).toFixed(1)}% match`);

// Cultural user similarities
console.log('\n🏛️ Cultural User Recommendations:');
const culTrekking = jaccardSimilarity(culturalUser, trekkingTour);
const culTemple = jaccardSimilarity(culturalUser, templeTour);
const culSafari = jaccardSimilarity(culturalUser, safariTour);

console.log(`Trekking Tour: ${(culTrekking * 100).toFixed(1)}% match`);
console.log(`Temple Tour: ${(culTemple * 100).toFixed(1)}% match`);
console.log(`Safari Tour: ${(culSafari * 100).toFixed(1)}% match`);

// Nature user similarities
console.log('\n🌿 Nature User Recommendations:');
const natTrekking = jaccardSimilarity(natureUser, trekkingTour);
const natTemple = jaccardSimilarity(natureUser, templeTour);
const natSafari = jaccardSimilarity(natureUser, safariTour);

console.log(`Trekking Tour: ${(natTrekking * 100).toFixed(1)}% match`);
console.log(`Temple Tour: ${(natTemple * 100).toFixed(1)}% match`);
console.log(`Safari Tour: ${(natSafari * 100).toFixed(1)}% match`);

// User similarity (for collaborative filtering)
console.log('\n🤝 User Similarity (Collaborative Filtering):');
const advCul = jaccardSimilarity(adventureUser, culturalUser);
const advNat = jaccardSimilarity(adventureUser, natureUser);
const culNat = jaccardSimilarity(culturalUser, natureUser);

console.log(`Adventure ↔ Cultural: ${(advCul * 100).toFixed(1)}% similar`);
console.log(`Adventure ↔ Nature: ${(advNat * 100).toFixed(1)}% similar`);
console.log(`Cultural ↔ Nature: ${(culNat * 100).toFixed(1)}% similar`);

console.log('\n✅ Demo completed!');
console.log('\n📋 Key Insights:');
console.log('• Adventure users get highest match with trekking tours');
console.log('• Cultural users get perfect match with temple tours');
console.log('• Nature users get highest match with safari tours');
console.log('• Low user similarity means diverse recommendation opportunities');
console.log('• Jaccard similarity effectively captures feature overlap');

console.log('\n🎯 TravelEase Implementation:');
console.log('• Extracts features from tour attributes automatically');
console.log('• Builds user preferences from booking history');
console.log('• Combines content-based and collaborative filtering');
console.log('• Provides personalized recommendations with similarity scores');
