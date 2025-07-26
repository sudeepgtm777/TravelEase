const express = require('express');
const router = express.Router();

const responses = {
  // Greetings
  hello: 'Hi there! How can I help you today?',
  hi: 'Hello! What can I assist you with regarding your travel plans?',
  'how are you':
    "I'm a bot, but I'm doing great! Thanks for asking. How can I help you?",

  // Tour info
  'what places can i visit':
    'We have amazing destinations like Chitwan National Park, Pokhara, Kathmandu Valley, Lumbini, and Everest Base Camp. Which one are you interested in?',
  'popular places in nepal':
    'Some must-visit places are Kathmandu, Pokhara, Chitwan, Lumbini, Everest Base Camp, Annapurna Circuit, and Rara Lake.',
  'adventure activities':
    'You can enjoy trekking, white-water rafting, paragliding, jungle safaris, mountain biking, and zip-lining in Nepal!',
  'cultural sites':
    'Explore World Heritage Sites like Pashupatinath Temple, Swayambhunath (Monkey Temple), Boudhanath, and Patan Durbar Square.',

  // Destination descriptions
  mustang:
    'Mustang is a stunning region in Nepal known for its desert landscapes, Tibetan culture, ancient caves, and the walled city of Lo Manthang.',
  pokhara:
    'Pokhara is a beautiful lakeside city famous for adventure sports, mountain views, boating on Phewa Lake, and peaceful ambiance.',
  lumbini:
    'Lumbini is the birthplace of Lord Buddha, home to peaceful monasteries and a sacred garden marking his birth site.',
  chitwan:
    'Chitwan is famous for jungle safaris, rhino sightings, birdwatching, and experiencing Tharu culture.',
  kathmandu:
    'Kathmandu, Nepal’s capital, is rich with temples, palaces, bustling markets, and UNESCO World Heritage Sites.',
  janakpur:
    'Janakpur is a historical and cultural city, birthplace of Sita, known for Janaki Mandir and vibrant festivals.',
  ghandruk:
    'Ghandruk is a charming Gurung village with stone-paved paths, stunning views of Annapurna, and warm hospitality.',
  lalitpur:
    'Lalitpur (Patan) is known for its rich art, architecture, and ancient temples, especially around Patan Durbar Square.',
  poonhill:
    'Poon Hill offers one of the best sunrise views of the Himalayas and is part of a popular short trek in the Annapurna region.',
  rara: 'Rara Lake is Nepal’s largest lake, surrounded by pristine forests and mountains, perfect for peace, photography, and nature.',
  'annapurna base camp':
    'Annapurna Base Camp (ABC) is a scenic trek through villages and valleys leading to a breathtaking mountain amphitheater.',
  bandipur:
    'Bandipur is a hilltop town known for preserved culture, traditional homes, and stunning mountain views.',
  manang:
    'Manang is a Himalayan village on the Annapurna Circuit, known for dramatic scenery and acclimatization before Thorong La Pass.',
  dhorpatan:
    'Dhorpatan is Nepal’s only hunting reserve and a remote trekking area with rich wildlife and mountain landscapes.',
  bardiya:
    'Bardiya National Park is ideal for spotting tigers, elephants, and wild animals on a quiet jungle safari experience.',

  // Packages
  'do you offer tour packages':
    'Yes, we offer various tour packages, including adventure tours, cultural tours, treks, and wildlife safaris. Want help choosing one?',
  'can i customize my tour':
    'Absolutely! You can customize your itinerary, activities, and accommodations according to your preferences.',
  'group or solo tour':
    'We offer both group tours and private tours for solo travelers, couples, families, or corporate groups.',

  // Travel & Logistics
  'do i need a visa':
    'Most travelers can get a visa on arrival in Nepal. But please check your country’s eligibility or ask us for help.',
  'what is the currency in nepal':
    'The currency is Nepalese Rupee (NPR). 1 USD is approximately 130 NPR (check for current rates).',
  'best time to visit nepal':
    'The best time to visit Nepal is during spring (March–May) and autumn (September–November) for clear skies and good weather.',
  'is nepal safe':
    'Yes, Nepal is generally safe for tourists. We also provide experienced guides for treks and tours.',
  'what languages are spoken':
    'Nepali is the official language. English is widely spoken in tourist areas, hotels, and by guides.',

  // Booking
  'how to book a tour':
    'You can book directly from our website or contact us via email or phone. We’re happy to assist!',
  'how to pay':
    'We accept payment via credit/debit card, bank transfer, and digital wallets. Let us know your preference.',
  'do you provide accommodation':
    'Yes, our tour packages usually include hotel stays. You can choose between budget, standard, and luxury options.',
  'can i cancel or reschedule':
    'Yes, we have a flexible cancellation and rescheduling policy. Contact us at least 48 hours in advance.',

  // Contact
  'contact us': 'You can reach us at TravelEase8848@gmail.com.',
  'where are you located':
    'Our main office is in Butwal, Rupandehi. Feel free to visit or call us for assistance.',

  // Farewells
  'thank you': "You're welcome! Feel free to ask if you have more questions.",
  thanks: "You're most welcome. Let me know if I can help with anything else.",
  bye: 'Goodbye! Have a great day and safe travels!',
  'see you': 'See you! Wishing you an amazing travel experience in Nepal!',

  // Duration-based itineraries
  'i have 3 days':
    'With 3 days, explore Kathmandu or Pokhara for a short but memorable experience.',
  'i have 5 days':
    'With 5 days, you can combine Kathmandu and Pokhara or do a short trek like Ghandruk.',
  'i have 7 days':
    'A 7-day trip fits Kathmandu, Pokhara, and a jungle safari in Chitwan perfectly.',
  'i have 10 days':
    'In 10 days, explore Kathmandu, Pokhara, Lumbini, and go on a light trek.',
  'i have 2 weeks':
    'With 2 weeks, enjoy cultural cities, wildlife parks, and a full trek like Annapurna Base Camp.',

  // User type personalization
  'i am a solo traveler':
    'Great! We offer safe and fun packages for solo travelers with guides and optional group tours.',
  'we are a couple':
    'Wonderful! We have romantic packages and cozy getaways in Pokhara and hill towns.',
  'we are a family':
    'Nice! Family-friendly tours include jungle safaris, easy hikes, and cultural activities.',
  'corporate group':
    'We arrange customized tours with team-building activities, premium hotels, and transport.',
  'traveling with kids':
    'Kid-friendly destinations include Pokhara, Chitwan, and short cultural tours in Kathmandu.',

  mustang:
    'Mustang is a stunning region in Nepal known for its desert landscapes, Tibetan culture, ancient caves, and the walled city of Lo Manthang.',
  'mustang weather':
    'Mustang has a dry, cold desert climate. Summers are warm, winters are chilly with snow in December-January.',
  'mustang food':
    'Try Tibetan-style dishes like Thukpa, Yak cheese, and momos in Mustang.',
  'mustang permits':
    'Upper Mustang requires a special permit costing about $500 for 10 days, mandatory for all visitors.',
  'how to get to mustang':
    'You can fly from Pokhara to Jomsom or trek via Annapurna Circuit to Mustang.',
  'mustang festivals':
    'Tiji festival is the major cultural event in Mustang, celebrated in Lo Manthang in May.',
  'mustang emergency':
    'In Mustang, medical facilities are limited. Carry basic medicines and emergency contacts before trekking.',
  'mustang shopping':
    'Handmade Tibetan crafts, woolen clothes, and prayer flags are popular souvenirs in Mustang.',

  // Pokhara
  pokhara:
    'Pokhara is a beautiful lakeside city famous for adventure sports, mountain views, boating on Phewa Lake, and peaceful ambiance.',
  'pokhara weather':
    'Pokhara experiences mild weather, with warm summers and cool winters. Monsoon arrives June-September.',
  'pokhara food':
    'Popular dishes include Newari cuisine, momo dumplings, and fresh trout fish from the lake.',
  'how to get to pokhara':
    'Pokhara is accessible by bus, private car, or domestic flight from Kathmandu.',
  'pokhara permits':
    'No special permits are required for Pokhara city, but trekking nearby may require permits.',
  'pokhara festivals':
    'Pokhara hosts many festivals including Tihar, Holi, and Buddha Jayanti celebrations.',
  'pokhara emergency':
    'Hospitals and clinics are available in Pokhara city. Emergency number: 100 for police.',
  'pokhara shopping':
    'Try buying handicrafts, pashmina shawls, and local art in Lakeside market.',

  // Lumbini
  lumbini:
    'Lumbini is the birthplace of Lord Buddha, home to peaceful monasteries and a sacred garden marking his birth site.',
  'lumbini weather':
    'Lumbini has a subtropical climate with hot summers and mild winters.',
  'lumbini food':
    'Local Terai cuisine includes rice, lentils, vegetables, and sweets like jalebi.',
  'how to get to lumbini':
    'Accessible by bus or flight to Bhairahawa, then a short drive to Lumbini.',
  'lumbini permits': 'No special permits required for visiting Lumbini.',
  'lumbini festivals':
    'Buddha Jayanti is the main festival celebrated with prayers and gatherings.',
  'lumbini emergency':
    'Medical facilities available in nearby Bhairahawa city.',
  'lumbini shopping':
    'Souvenirs include Buddhist artifacts, prayer beads, and handicrafts.',

  // Chitwan
  chitwan:
    'Chitwan is famous for jungle safaris, rhino sightings, birdwatching, and experiencing Tharu culture.',
  'chitwan weather':
    'Chitwan has a humid subtropical climate; hot summers and mild winters.',
  'chitwan food':
    'Try Tharu traditional dishes like Dhido, Gundruk soup, and fresh river fish.',
  'how to get to chitwan':
    'Accessible by bus or car from Kathmandu or Pokhara.',
  'chitwan permits':
    'National park entry fees and permits required for safari activities.',
  'chitwan festivals':
    'Tharu Cultural Festival showcases traditional dance and music annually.',
  'chitwan emergency':
    'Hospitals are available in Bharatpur city near the park entrance.',
  'chitwan shopping':
    'Local crafts, Tharu handmade items, and elephant-themed souvenirs.',

  // Kathmandu
  kathmandu:
    'Kathmandu, Nepal’s capital, is rich with temples, palaces, bustling markets, and UNESCO World Heritage Sites.',
  'kathmandu weather':
    'Kathmandu has a temperate climate; warm summers and cool winters.',
  'kathmandu food':
    'Famous for momos, Newari cuisine, dal bhat, and street food.',
  'how to get to kathmandu':
    'Tribhuvan International Airport serves Kathmandu with flights worldwide.',
  'kathmandu permits': 'No special permits required for city tours.',
  'kathmandu festivals':
    'Major festivals include Dashain, Tihar, Indra Jatra, and Holi.',
  'kathmandu emergency':
    'Well-equipped hospitals and emergency services available in the city.',
  'kathmandu shopping':
    'Thamel area is best for souvenirs, handicrafts, pashmina, and trekking gear.',

  // Janakpur
  janakpur:
    'Janakpur is a historical and cultural city, birthplace of Sita, known for Janaki Mandir and vibrant festivals.',
  'janakpur weather':
    'Janakpur has a tropical climate; hot summers and mild winters.',
  'janakpur food':
    'Local Maithili dishes include litti chokha, fish curry, and sweets.',
  'how to get to janakpur':
    'Accessible by bus or domestic flights to Janakpur Airport.',
  'janakpur permits': 'No special permits required.',
  'janakpur festivals':
    'Famous for Vivah Panchami and other Hindu religious festivals.',
  'janakpur emergency':
    'Basic health facilities available; larger hospitals in nearby cities.',
  'janakpur shopping': 'Traditional Maithili paintings and handicrafts.',

  // Ghandruk
  ghandruk:
    'Ghandruk is a charming Gurung village with stone-paved paths, stunning views of Annapurna, and warm hospitality.',
  'ghandruk weather': 'Cool mountain climate; cold winters and mild summers.',
  'ghandruk food':
    'Local dishes include dal bhat, gundruk, and home-made cheese.',
  'how to get to ghandruk': 'Reachable by trekking from Pokhara or Nayapul.',
  'ghandruk permits':
    'Trekking permits like TIMS required for Annapurna region.',
  'ghandruk festivals': 'Local Gurung festivals with dance and music.',
  'ghandruk emergency':
    'Basic health posts available; larger facilities in Pokhara.',
  'ghandruk shopping': 'Handicrafts, woolen goods, and local jewelry.',

  // Lalitpur
  lalitpur:
    'Lalitpur (Patan) is known for its rich art, architecture, and ancient temples, especially around Patan Durbar Square.',
  'lalitpur weather': 'Similar to Kathmandu; temperate climate.',
  'lalitpur food':
    'Enjoy Newari cuisine, especially in local eateries around Patan.',
  'how to get to lalitpur':
    'Close to Kathmandu, accessible by road and public transport.',
  'lalitpur permits': 'No special permits needed.',
  'lalitpur festivals':
    'Various Hindu and Buddhist festivals celebrated actively.',
  'lalitpur emergency': 'Hospitals and clinics available.',
  'lalitpur shopping': 'Traditional crafts, metal works, and local art.',

  // Poonhill
  poonhill:
    'Poon Hill offers one of the best sunrise views of the Himalayas and is part of a popular short trek in the Annapurna region.',
  'poonhill weather':
    'Cool climate with cold nights; best trekking season is spring and autumn.',
  'poonhill food': 'Simple trekking food; dal bhat, noodles, and soups.',
  'how to get to poonhill': 'Reachable by trekking from Nayapul or Pokhara.',
  'poonhill permits':
    'TIMS and Annapurna Conservation Area Project permits required.',
  'poonhill festivals': 'Local festivals along the trekking route.',
  'poonhill emergency':
    'Basic medical posts on the trail; main hospitals in Pokhara.',
  'poonhill shopping': 'Handmade trekking gear and souvenirs in Pokhara.',

  // Rara
  rara: 'Rara Lake is Nepal’s largest lake, surrounded by pristine forests and mountains, perfect for peace, photography, and nature.',
  'rara weather': 'Cold alpine climate; snow possible in winter months.',
  'rara food': 'Simple local dishes, mostly dal bhat and seasonal vegetables.',
  'how to get to rara':
    'Fly from Kathmandu to Nepalgunj, then a local flight or trek to Rara.',
  'rara permits': 'National park entry permit required.',
  'rara festivals': 'Local cultural events by nearby communities.',
  'rara emergency': 'Limited medical facilities; carry first aid.',
  'rara shopping': 'Local handmade crafts and souvenirs.',

  // Annapurna Base Camp
  'annapurna base camp':
    'Annapurna Base Camp (ABC) is a scenic trek through villages and valleys leading to a breathtaking mountain amphitheater.',
  'abc weather':
    'Variable; cool to cold depending on season, best trekking seasons are spring and autumn.',
  'abc food': 'Typical trekking meals including dal bhat, noodles, and soups.',
  'how to get to abc': 'Trek starting from Pokhara via Nayapul or Tikhedhunga.',
  'abc permits': 'TIMS and Annapurna Conservation Area permits required.',
  'abc festivals': 'Local village festivals during trekking season.',
  'abc emergency': 'Medical posts available on trail; hospital in Pokhara.',
  'abc shopping': 'Trekking gear and souvenirs in Pokhara.',

  // Bandipur
  bandipur:
    'Bandipur is a hilltop town known for preserved culture, traditional homes, and stunning mountain views.',
  'bandipur weather': 'Mild and temperate; pleasant summers and cool winters.',
  'bandipur food': 'Local Newari and hill dishes.',
  'how to get to bandipur': 'Accessible by road from Kathmandu or Pokhara.',
  'bandipur permits': 'No special permits required.',
  'bandipur festivals': 'Traditional Newari festivals are celebrated actively.',
  'bandipur emergency':
    'Basic health facilities; larger hospitals in nearby cities.',
  'bandipur shopping': 'Local handicrafts and souvenirs.',

  // Manang
  manang:
    'Manang is a Himalayan village on the Annapurna Circuit, known for dramatic scenery and acclimatization before Thorong La Pass.',
  'manang weather': 'Cold alpine climate; snow likely in winter.',
  'manang food': 'Tibetan and local dishes such as yak meat and butter tea.',
  'how to get to manang': 'Trek from Besisahar via the Annapurna Circuit.',
  'manang permits': 'TIMS and ACAP permits required.',
  'manang festivals': 'Local cultural and Buddhist festivals.',
  'manang emergency': 'Medical clinic available; larger hospital in Pokhara.',
  'manang shopping': 'Local wool products and handicrafts.',

  // Dhorpatan
  dhorpatan:
    'Dhorpatan is Nepal’s only hunting reserve and a remote trekking area with rich wildlife and mountain landscapes.',
  'dhorpatan weather': 'Mountain climate with cold winters and mild summers.',
  'dhorpatan food': 'Simple local food available during trekking.',
  'how to get to dhorpatan':
    'Accessible via trekking routes and some local roads.',
  'dhorpatan permits': 'Hunting and conservation permits required.',
  'dhorpatan festivals': 'Traditional local festivals.',
  'dhorpatan emergency': 'Limited medical facilities; prepare accordingly.',
  'dhorpatan shopping': 'Local crafts and woolen goods.',

  // Bardiya
  bardiya:
    'Bardiya National Park is a wild sanctuary ideal for spotting tigers, elephants, and crocodiles on a quiet jungle safari.',
  'bardiya weather': 'Subtropical with hot summers and mild winters.',
  'bardiya food': 'Terai style food including rice, lentils, and fish.',
  'how to get to bardiya':
    'Accessible by bus or car from Nepalgunj or Kathmandu.',
  'bardiya permits': 'National park entry permit and safari permits required.',
  'bardiya festivals': 'Local Tharu cultural festivals.',
  'bardiya emergency': 'Basic health centers nearby.',
  'bardiya shopping': 'Handmade Tharu crafts and souvenirs.',

  // Packing
  'what to bring':
    'Pack trekking shoes, warm clothes, sunscreen, water bottle, basic meds, and ID. Want a checklist?',
  'packing list':
    'Bring layers, power bank, snacks, rain jacket, headlamp, gloves, and a hygiene kit.',
  'what to pack':
    'Packing depends on the region and season. Tell me your destination for a specific list.',

  // Extras
  'travel tip':
    'Always keep a copy of your passport, drink clean water, and take altitude slowly.',
  'fun fact':
    'Nepal is the only country with a non-rectangular flag and has 8 of the 10 highest peaks in the world.',

  // Fallback
  default:
    "I'm sorry, I didn't understand that. Can you rephrase or ask something related to travel in Nepal?",
};

// getResponse function as you have, unchanged:
function getResponse(input) {
  const text = input.toLowerCase();

  // Direct exact match
  if (responses[text]) return responses[text];

  // Keyword match for places + topics
  const places = [
    'mustang',
    'pokhara',
    'lumbini',
    'chitwan',
    'kathmandu',
    'janakpur',
    'ghandruk',
    'lalitpur',
    'poonhill',
    'rara',
    'annapurna base camp',
    'bandipur',
    'manang',
    'dhorpatan',
    'bardiya',
  ];
  const topics = [
    'weather',
    'food',
    'permits',
    'how to get',
    'festivals',
    'emergency',
    'shopping',
  ];

  for (const place of places) {
    if (text.includes(place)) {
      for (const topic of topics) {
        if (text.includes(topic)) {
          const key = place + ' ' + topic;
          if (responses[key]) return responses[key];
        }
      }
      // If just place mentioned without topic, return place intro
      if (responses[place]) return responses[place];
    }
  }

  return responses.default;
}

// Your Express POST route - just call getResponse here
router.post('/chatbotresponse', (req, res) => {
  const userMessage = req.body.message || '';
  const botResponse = getResponse(userMessage);

  res.json({ reply: botResponse });
});

module.exports = router;