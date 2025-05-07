SELECT * FROM public.waypoint
ORDER BY id ASC;

SELECT COUNT(*) FROM waypoint
WHERE fclass='monument';

SELECT DISTINCT fclass FROM waypoint;

SELECT * FROM waypoint
WHERE name IS null;

DELETE FROM waypoint
WHERE fclass IN (
  'atm', 'bakery', 'bank', 'bar', 'beauty_shop', 'beverages', 'bicycle_shop',
  'bookshop', 'butcher', 'camera_surveillance', 'car_dealership', 'car_rental',
  'car_wash', 'chemist', 'clinic', 'clothes', 'college', 'comms_tower',
  'computer_shop', 'convenience', 'courthouse', 'department_store', 'dentist',
  'doctors', 'doityourself', 'embassy', 'fast_food', 'fire_station',
  'florist', 'food_court', 'furniture_shop', 'garden_centre', 'general',
  'gift_shop', 'greengrocer', 'guesthouse', 'hairdresser', 'hostel', 'hotel',
  'jeweller', 'kiosk', 'laundry', 'library', 'mall', 'market_place', 'mobile_phone_shop',
  'motel', 'museum', 'newsagent', 'nightclub', 'nursing_home', 'optician',
  'pharmacy', 'playground', 'police', 'post_box', 'post_office',
  'pub', 'restaurant', 'recycling', 'recycling_clothes', 'recycling_glass',
  'recycling_metal', 'recycling_paper', 'ruins', 'school', 'shelter', 'shoe_shop',
  'sports_centre', 'sports_shop', 'stationery', 'supermarket', 'swimming_pool',
  'telephone', 'theatre', 'toilet', 'toy_shop', 'track', 'travel_agent', 'university',
  'vending_any', 'vending_machine', 'vending_parking', 'video_shop', 'waste_basket',
  'wastewater_plant', 'water_mill', 'water_tower', 'water_works', 'town_hall', 'hunting_stand',
  'dog_park' , 'prison', 'biergarten', 'kindergarten', 'caravan_site', 'pitch', 'artwork',
  'outdoor_shop', 'wayside_shrine', 'arts_centre', 'zoo', 'wayside_cross', 'chalet',
  'cafe', 'stadium', 'battlefield', 'bicycle_rental', 'community_centre', 'archaeological',
  'memorial', 'graveyard', 'cinema', 'alpine_hut', 'tower', 'tourist_info', 'observation_tower',
  'camp_site', 'attraction', 'picnic_site', 'fountain', 'fort', 'castle', 'hospital',
  'veterinary', 'bench', 'water_well'
);

