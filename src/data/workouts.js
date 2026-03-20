const s = (z, m, lbl) => ({ z, m, lbl })

export const WORKOUTS = {
  easy_30: {
    title: '30min Easy', type: 'EASY', totalMins: 30,
    coach: 'Pure Z2. Hold a full conversation throughout. If HR creeps above Z2, ease off — even on slight rises.',
    segs: [s(1,5,'Warm-up'), s(2,20,'Aerobic base'), s(1,5,'Cool-down')],
  },
  easy_45: {
    title: '45min Easy', type: 'EASY', totalMins: 45,
    coach: 'Flat course. Focus on cadence (85-95rpm). Z2 only — no Z3 just because you feel good.',
    segs: [s(1,8,'Warm-up'), s(2,29,'Aerobic base'), s(1,8,'Cool-down')],
  },
  easy_60: {
    title: '60min Easy', type: 'EASY', totalMins: 60,
    coach: 'Bread and butter aerobic session. Comfortable, controlled, sustainable.',
    segs: [s(1,10,'Warm-up'), s(2,45,'Aerobic base'), s(1,5,'Cool-down')],
  },
  easy_30_sprints: {
    title: '30min Easy + 4×30sec Openers', type: 'EASY', totalMins: 30,
    coach: 'Event-week leg opener. 30sec bursts wake fast-twitch fibres without fatiguing you. Stay Z1-Z2 around each effort.',
    segs: [s(1,5,'Warm-up'),s(2,5,'Build'),s(5,0.5,'On'),s(1,1,'Off'),s(5,0.5,'On'),s(1,1,'Off'),s(5,0.5,'On'),s(1,1,'Off'),s(5,0.5,'On'),s(1,1,'Off'),s(2,7,'Easy spin'),s(1,4,'Cool-down')],
  },

  long_45: {
    title: '45min Long (Rolling)', type: 'LONG', totalMins: 45,
    coach: 'Aim Z2 on flats. On climbs stay seated and let power rise briefly into Z3. Recover fully on descents.',
    segs: [s(1,8,'Warm-up'), s(2,30,'Aerobic base'), s(1,7,'Cool-down')],
  },
  long_60_flat: {
    title: '60min Long (Flat)', type: 'LONG', totalMins: 60,
    coach: 'Flat course — best chance to hold Z2 consistently. Focus on smooth even power.',
    segs: [s(1,10,'Warm-up'), s(2,45,'Aerobic base'), s(1,5,'Cool-down')],
  },
  long_60_rolling: {
    title: '60min Long (Rolling)', type: 'LONG', totalMins: 60,
    coach: 'Natural Z3 spikes on climbs are fine. Use flat/descent time to drop fully back to Z2 before the next rise.',
    segs: [s(1,10,'Warm-up'),s(2,18,'Aerobic base'),s(3,7,'Hills'),s(2,10,'Recover'),s(3,8,'Hills'),s(2,5,'Recover'),s(1,2,'Cool-down')],
  },
  long_90: {
    title: '90min Long (Rolling)', type: 'LONG', totalMins: 90,
    coach: 'Eat every 30 mins. Stay seated on every climb. Goal is time-in-zone, not speed.',
    segs: [s(1,15,'Warm-up'), s(2,65,'Aerobic base'), s(1,10,'Cool-down')],
  },
  long_90_taper: {
    title: '90min Long (Taper)', type: 'LONG', totalMins: 90,
    coach: 'Taper week — legs should feel fresh. Strictly Z1-Z2. Maintain fitness without adding fatigue.',
    segs: [s(1,15,'Warm-up'), s(2,65,'Aerobic base'), s(1,10,'Cool-down')],
  },
  long_90_rolling: {
    title: '1hr 30min Long (Rolling)', type: 'LONG', totalMins: 90,
    coach: 'Day after a big practice ride — active recovery. Keep Z2 strictly. Tired legs are expected.',
    segs: [s(1,15,'Warm-up'),s(2,60,'Aerobic base'),s(3,8,'Natural climbs'),s(2,5,'Recover'),s(1,2,'Cool-down')],
  },

  hard_45_bursts: {
    title: '45min Hard — Short Bursts', type: 'HARD', totalMins: 45,
    coach: '10-20 sec Z5 neuromuscular efforts. FULLY recover to Z1 between each — non-negotiable. Recovery quality = next effort quality. Do NOT let recovery drift into Z3.',
    segs: [s(1,10,'Warm-up'),s(2,5,'Build'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(5,0.25,'Burst'),s(1,2.75,'Recover'),s(2,3,'Endurance'),s(1,5,'Cool-down')],
  },
  hard_45_4x5: {
    title: '45min Hard — 4×5min Threshold', type: 'HARD', totalMins: 45,
    coach: 'Sustained Z4 near FTP. If you can\'t hold the range drop to Z3 rather than blowing up. FULL Z1 recovery between intervals.',
    segs: [s(1,8,'Warm-up'),s(2,2,'Build'),s(4,5,'Int 1'),s(1,3,'Recovery'),s(4,5,'Int 2'),s(1,3,'Recovery'),s(4,5,'Int 3'),s(1,3,'Recovery'),s(4,5,'Int 4'),s(1,3,'Recovery'),s(1,3,'Cool-down')],
  },
  hard_60_5x5: {
    title: '60min Hard — 5×5min Threshold', type: 'HARD', totalMins: 60,
    coach: 'One extra interval vs previous weeks. Truly hard efforts, truly easy recovery. 25 mins total at Z4.',
    segs: [s(1,10,'Warm-up'),s(2,5,'Build'),s(4,5,'Int 1'),s(1,3,'Recovery'),s(4,5,'Int 2'),s(1,3,'Recovery'),s(4,5,'Int 3'),s(1,3,'Recovery'),s(4,5,'Int 4'),s(1,3,'Recovery'),s(4,5,'Int 5'),s(1,3,'Recovery'),s(1,5,'Cool-down')],
  },
  hard_60_6x5: {
    title: '60min Hard — 6×5min Threshold', type: 'HARD', totalMins: 60,
    coach: 'Peak interval session — 30 mins total at Z4. Trust your training.',
    segs: [s(1,8,'Warm-up'),s(2,2,'Build'),s(4,5,'Int 1'),s(1,3,'Recovery'),s(4,5,'Int 2'),s(1,3,'Recovery'),s(4,5,'Int 3'),s(1,3,'Recovery'),s(4,5,'Int 4'),s(1,3,'Recovery'),s(4,5,'Int 5'),s(1,3,'Recovery'),s(4,5,'Int 6'),s(1,3,'Recovery'),s(1,2,'Cool-down')],
  },
  hard_60_4x8: {
    title: '60min Hard — 4×8min Threshold', type: 'HARD', totalMins: 60,
    coach: '8 mins at Z4 is mentally tough — break each into two 4-min halves. Most event-specific intervals in the plan.',
    segs: [s(1,10,'Warm-up'),s(2,2,'Build'),s(4,8,'Int 1'),s(1,3,'Recovery'),s(4,8,'Int 2'),s(1,3,'Recovery'),s(4,8,'Int 3'),s(1,3,'Recovery'),s(4,8,'Int 4'),s(1,3,'Recovery'),s(1,4,'Cool-down')],
  },

  steady_30_brisk: {
    title: '30min Steady — 4×1.5min Brisk', type: 'STEADY', totalMins: 30,
    coach: 'Taper sharpener. Brief Z3 efforts remind legs what effort feels like. Don\'t overdo it — 2 weeks to event.',
    segs: [s(1,5,'Warm-up'),s(2,5,'Build'),s(3,1.5,'Brisk 1'),s(1,2,'Recover'),s(3,1.5,'Brisk 2'),s(1,2,'Recover'),s(3,1.5,'Brisk 3'),s(1,2,'Recover'),s(3,1.5,'Brisk 4'),s(1,2,'Recover'),s(2,2,'Easy'),s(1,3,'Cool-down')],
  },
  steady_45: {
    title: '45min Steady', type: 'STEADY', totalMins: 45,
    coach: 'Event week. Enough to feel loose and sharp, not enough to tire. Preparation, not training.',
    segs: [s(1,8,'Warm-up'),s(2,15,'Build'),s(3,12,'Steady'),s(2,7,'Ease down'),s(1,3,'Cool-down')],
  },
  steady_2hr: {
    title: '2hr Steady (Rolling)', type: 'STEADY', totalMins: 120,
    coach: 'This IS your hard 20% for the week. A pace where you CAN speak but don\'t want to. Eat at 30, 60, 90 mins.',
    segs: [s(1,15,'Warm-up'),s(2,15,'Build'),s(3,75,'Tempo'),s(2,10,'Ease down'),s(1,5,'Cool-down')],
  },
  steady_2hr30: {
    title: '2hr 30min Steady (Rolling)', type: 'STEADY', totalMins: 150,
    coach: 'Extra 30 mins of Z3. The final 30 mins will feel genuinely hard — that\'s the training stimulus. Eat every 30 mins.',
    segs: [s(1,15,'Warm-up'),s(2,20,'Build'),s(3,90,'Tempo'),s(2,15,'Ease'),s(1,10,'Cool-down')],
  },
  steady_3hr: {
    title: '3hr Steady (Rolling)', type: 'STEADY', totalMins: 180,
    coach: '2 hours at Z3 — your biggest fitness builder for Ditchling. Eat at 30, 60, 90, 120, 150 mins. Struggling in the last 30? Drop to Z2 — still a great session.',
    segs: [s(1,15,'Warm-up'),s(2,20,'Build'),s(3,120,'Tempo'),s(2,20,'Ease'),s(1,5,'Cool-down')],
  },

  practice_3hr: {
    title: '3hr Practice Ride', type: 'PRACTICE', totalMins: 180,
    coach: 'Similar terrain to event. Z2 base with Z3 on hills. Practise eating on the bike. Sustainable effort throughout.',
    segs: [s(1,15,'Warm-up'),s(2,65,'Aerobic base'),s(3,25,'Rolling hills'),s(2,50,'Mid section'),s(3,20,'Final push'),s(1,5,'Cool-down')],
  },
  practice_3hr30: {
    title: '3hr 30min Practice Ride', type: 'PRACTICE', totalMins: 210,
    coach: 'Use a GPX similar to L2B route. Z2 on flats, Z3 on climbs. Build confidence and fuelling habits.',
    segs: [s(1,20,'Warm-up'),s(2,80,'Aerobic base'),s(3,30,'Surrey hills'),s(2,60,'Mid section'),s(3,15,'South Downs sim'),s(1,5,'Cool-down')],
  },
  practice_4hr30: {
    title: '4hr 30min Practice Ride', type: 'PRACTICE', totalMins: 270,
    coach: 'Eat 60-80g carbs/hr aggressively. Z2 base, Z3 on climbs. Longest ride before the 5hr.',
    segs: [s(1,20,'Warm-up'),s(2,100,'Aerobic base'),s(3,40,'Rolling terrain'),s(2,70,'Mid-late'),s(3,30,'South Downs sim'),s(1,10,'Cool-down')],
  },
  practice_5hr: {
    title: '5hr Practice Ride ⭐', type: 'PRACTICE', totalMins: 300,
    coach: 'Biggest confidence builder. Route must closely mimic L2B with a Ditchling-style climb near the end. Eat 60-80g carbs/hr. After this, taper begins.',
    segs: [s(1,20,'Warm-up'),s(2,120,'Aerobic base'),s(3,50,'Rolling terrain'),s(2,70,'Mid-late'),s(3,30,'South Downs'),s(4,5,'Beacon sim'),s(2,5,'Finish')],
  },

  ftp_test: {
    title: '📊 FTP Test', type: 'FTP', totalMins: 46, ftpNote: true,
    coach: 'Go purely on feel for the 20min — do NOT pace off last month\'s number. New FTP = 20min avg power × 0.95. Enter the result in the panel above.',
    segs: [s(2,10,'Z2 Warm-up'),s(5,1,'Opener 1'),s(1,1,'Recovery'),s(5,1,'Opener 2'),s(1,1,'Recovery'),s(5,1,'Opener 3'),s(1,1,'Recovery'),s(2,5,'Z2 Buffer'),s(5,20,'⚡ 20min ALL OUT'),s(1,5,'Cool-down')],
  },

  sc_30: { title: '30min S&C', type: 'SC', totalMins: 30, coach: 'Press-ups, split squats, calf raises, Russian twists, plank, side leg raises. See conditioning guide.', segs: [] },
  sc_45: { title: '45min S&C', type: 'SC', totalMins: 45, coach: 'Full conditioning circuit — 2 rounds of all exercises with 45s rest between sets.', segs: [] },
  sc_60: { title: '60min S&C', type: 'SC', totalMins: 60, coach: 'Full conditioning circuit — 3 rounds. Focus on glute strength and core stability.', segs: [] },
  rest:  { title: 'Rest Day',  type: 'REST', totalMins: 0, coach: 'Sleep, eat well, stretch lightly. Rest days are where fitness is actually built.', segs: [] },
  event: { title: '🚴 LONDON TO BRIGHTON!', type: 'EVENT', totalMins: 360, coach: 'You\'ve done the work. Trust your training. Start conservatively, eat early and often, walk Ditchling Beacon if you need to. Enjoy every mile with Joe 🎉', segs: [] },
}
