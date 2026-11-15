export interface StoryBeat { label: string; text: string }
export interface StoryChallenge {
  question: string
  options: [string, string]
  answer: number
  success: string
  hint: string
}

export interface Story {
  artifactId: string
  letterNumber: number
  kicker: string
  opening: string
  beats: StoryBeat[]
  humanThread: { title: string; text: string }
  whyItStayed: string
  closing: string
  nextId: string
  challenge: StoryChallenge
}

const lines: Record<string, { opening: string; beats: string[]; human: string; why: string; closing: string }> = {
  'apollo-11-descent-stage': { opening: 'I helped people land on the Moon!', beats: ['I was the bottom half of Eagle. I carried the engine, fuel, and four landing legs.', 'Neil Armstrong steered me around big rocks. We landed with very little fuel left.', 'The top half flew the astronauts home. I stayed beside the first Moon footprints.'], human: 'Neil Armstrong and Buzz Aldrin trusted this machine during the first Moon landing.', why: 'Leaving me behind made the trip home lighter and safer.', closing: 'I stayed so the astronauts could fly home.' },
  'apollo-11-retroreflector': { opening: 'Shine a laser at me. I wink back!', beats: ['I am a small panel filled with special mirrors.', 'Scientists send a laser from Earth. I bounce the light straight back to them.', 'The round trip tells scientists exactly how far away the Moon is. I need no battery at all.'], human: 'Buzz Aldrin placed this mirror panel on the Moon in 1969.', why: 'I am a permanent measuring mark on the Moon.', closing: 'Even a quiet mirror can talk with light.' },
  'surveyor-3': { opening: 'I was a robot scout before astronauts arrived.', beats: ['I practised a gentle Moon landing without any people on board.', 'My camera took pictures, and my scoop touched Moon soil.', 'Three years later, Apollo 12 astronauts walked over to visit me.'], human: 'Pete Conrad and Alan Bean found Surveyor 3 and brought its camera back to Earth.', why: 'I showed humans that this part of the Moon was safe to visit.', closing: 'A good scout helps everyone who comes next.' },
  'apollo-17-descent': { opening: 'I carried Apollo’s last Moon explorers.', beats: ['I was the landing half of a spacecraft called Challenger.', 'I brought Gene Cernan and Harrison Schmitt down to a mountain valley on the Moon.', 'They flew home in the top half. My gold-covered body stayed with their tracks.'], human: 'Harrison Schmitt was a geologist—the first professional scientist to walk on the Moon.', why: 'I had finished my landing job and was too heavy to take home.', closing: 'The last Apollo footprints still have a launch pad.' },
  'spirit': { opening: 'My 90-day trip lasted more than six years!', beats: ['I was a six-wheeled robot built to study Martian rocks.', 'I climbed hills and found clues that Mars once had water.', 'Dust and a cold winter finally stopped my solar-powered adventure.'], human: 'A huge team on Earth drove Spirit carefully, one set of commands at a time.', why: 'My wheels stopped, so Mars became my forever home.', closing: 'A small rover can leave a very long trail.' },
  'ingenuity': { opening: 'I was the first helicopter to fly on another world!', beats: ['I rode to Mars tucked under the Perseverance rover.', 'My blades spun super fast because Mars has very thin air.', 'I was planned for five flights. I made 72 before a rotor was damaged.'], human: 'Student Vaneeza Rupani chose the name Ingenuity in a NASA contest.', why: 'I stayed where my final flight landed in Jezero Crater.', closing: 'One tiny helicopter opened a whole new sky.' },
  'curiosity': { opening: 'I am a rolling science lab climbing a mountain.', beats: ['I am about the size of a small car and carry many science tools.', 'I test rocks while slowly climbing Mount Sharp on Mars.', 'I keep sending home clues about places where tiny life might once have survived.'], human: 'Twelve-year-old Clara Ma gave Curiosity its name through a NASA essay contest.', why: 'I am still exploring, so my story is still being written.', closing: 'Every wheel turn can uncover a new clue.' },
  'perseverance': { opening: 'I am packing rock samples for future explorers.', beats: ['I search an ancient Martian lakebed for signs of tiny life from long ago.', 'My drill puts special rock pieces into sealed tubes.', 'I also carried Ingenuity and recorded the sounds of Mars.'], human: 'Seventh-grader Alex Mather chose the name Perseverance.', why: 'I am still busy collecting Mars stories for the future.', closing: 'A rock sample can be a message across time.' },
  'phoenix': { opening: 'I dug into Mars and found ice!', beats: ['I landed near the cold north pole of Mars.', 'My robot arm scraped the soil and uncovered frozen water just below it.', 'I even watched snow fall before the dark winter ended my mission.'], human: 'Engineers reused smart ideas and spare parts to build Phoenix.', why: 'I could not move away when the long, dark winter came.', closing: 'Sometimes the biggest discovery is hiding under your feet.' },
  'viking-1': { opening: 'I sent home the first clear view from Mars.', beats: ['I landed on Mars with cameras, weather tools, and life-detection experiments.', 'My pictures showed people a rocky orange world from ground level.', 'I worked for more than six years before my last message.'], human: 'Scientists, engineers, and storytellers like Carl Sagan helped the world understand Viking’s discoveries.', why: 'My tools had finished their long first look at Mars.', closing: 'One picture can make a faraway world feel real.' },
  'opportunity': { opening: 'I was built for 90 days. I explored for 15 years!', beats: ['I rolled across Mars looking for clues about ancient water.', 'I crossed plains, climbed out of craters, and travelled farther than a marathon.', 'A giant dust storm covered my solar panels and ended our messages.'], human: 'A student essay helped give Opportunity its hopeful name.', why: 'The storm left me without enough sunlight to keep going.', closing: 'Opportunity proved that brave little robots can surprise everyone.' },
  'luna-9': { opening: 'I proved that a spacecraft could land gently on the Moon.', beats: ['Before me, nobody knew if a lander might sink into deep Moon dust.', 'I bounced, rolled, opened up, and sent the first pictures from the Moon’s surface.', 'My battery lasted three days—long enough to change what people knew.'], human: 'The Luna 9 team solved a brand-new landing puzzle.', why: 'My short mission ended when my battery ran out.', closing: 'A three-day adventure can change the future.' },
  'apollo-15-lrv': { opening: 'I was the first car on the Moon!', beats: ['I was an electric buggy with four wire-mesh wheels.', 'Two astronauts drove me across the Hadley–Apennine hills to collect rocks.', 'When they flew home, I stayed parked with the tools still on board.'], human: 'David Scott and James Irwin drove me during Apollo 15.', why: 'I was too heavy to bring home, so I became a permanent parking spot.', closing: 'The Moon still has its first car.' },
  'apollo-12-alsep': { opening: 'I stayed awake after the astronauts left.', beats: ['I was a package of instruments set down on the Moon.', 'My seismometer listened for moonquakes while other tools measured the soil and the sky.', 'I sent data home for years until engineers switched me off.'], human: 'Pete Conrad and Alan Bean set me up during Apollo 12.', why: 'I was built to keep working without people, so I stayed behind.', closing: 'A quiet machine can listen for a very long time.' },
  sojourner: { opening: 'I was the first rover to drive on Mars.', beats: ['I rode to Mars folded inside the Pathfinder lander.', 'I rolled down a ramp and measured rocks at Ares Vallis.', 'When my lander stopped talking, my mission ended.'], human: 'A team on Earth picked where I should drive each day.', why: 'I stayed beside my lander in Ares Vallis.', closing: 'Every Mars rover since has followed my tracks.' },
  'viking-2': { opening: 'I landed on the other side of Mars.', beats: ['I was Viking 1’s twin, sent to a colder place called Utopia Planitia.', 'I photographed the surface, measured the weather and tested the soil.', 'I kept working for years before my power ran out.'], human: 'Scientists waited years for my pictures and measurements.', why: 'My power system finally failed in 1980.', closing: 'Twins can explore two sides of a world.' },
  insight: { opening: 'I put my ear to Mars.', beats: ['I landed in Elysium Planitia carrying a very sensitive seismometer.', 'I listened to marsquakes and measured the planet’s hidden layers.', 'Dust covered my solar panels and my power faded in 2022.'], human: 'Scientists used my quakes to map the inside of Mars.', why: 'My solar panels could not make enough power through the dust.', closing: 'Listening can reveal what you cannot see.' },
}

const challenges: Record<string, StoryChallenge> = {
  'apollo-11-descent-stage': {
    question: 'Why did the bottom half of Eagle stay on the Moon?',
    options: ['It made the trip home lighter', 'The astronauts forgot it'],
    answer: 0,
    success: 'Signal decoded! Leaving it behind helped the astronauts lift off safely.',
    hint: 'Think about what makes a spacecraft easier to lift.'
  },
  'apollo-11-retroreflector': {
    question: 'What does this mirror need to keep working?',
    options: ['A fresh battery', 'Only a laser from Earth'],
    answer: 1,
    success: 'Bright thinking! Its special mirrors need no power at all.',
    hint: 'The story says this quiet machine has no battery.'
  },
  'surveyor-3': {
    question: 'What made Surveyor 3 a useful scout?',
    options: ['It tested the ground first', 'It carried astronauts home'],
    answer: 0,
    success: 'Scout badge earned! It helped prove the landing area was safe.',
    hint: 'A scout visits before the main team arrives.'
  },
  'apollo-17-descent': {
    question: 'Who made Apollo 17 extra special?',
    options: ['A professional geologist', 'The first Mars pilot'],
    answer: 0,
    success: 'Rock-star answer! Harrison Schmitt studied the Moon as a geologist.',
    hint: 'Look at the “People in the story” clue.'
  },
  spirit: {
    question: 'How long was Spirit first planned to explore?',
    options: ['90 days', '90 years'],
    answer: 0,
    success: 'Correct! Then Spirit surprised everyone by lasting more than six years.',
    hint: 'It was meant to be a short adventure.'
  },
  ingenuity: {
    question: 'Why did Ingenuity’s blades spin so fast?',
    options: ['Mars has very thin air', 'Mars has giant waves'],
    answer: 0,
    success: 'Flight signal found! Fast blades helped it push against the thin air.',
    hint: 'Mars has much less air than Earth.'
  },
  curiosity: {
    question: 'What kind of explorer is Curiosity?',
    options: ['A rolling science lab', 'A flying telescope'],
    answer: 0,
    success: 'Lab badge earned! Curiosity studies rocks while climbing Mount Sharp.',
    hint: 'This explorer rolls on six wheels.'
  },
  perseverance: {
    question: 'Why is Perseverance filling tiny tubes?',
    options: ['To save rock samples', 'To grow space plants'],
    answer: 0,
    success: 'Sample secured! Those rocks may carry clues from ancient Mars.',
    hint: 'The tubes are a library for future scientists.'
  },
  phoenix: {
    question: 'What did Phoenix find under the soil?',
    options: ['Frozen water', 'A metal spaceship'],
    answer: 0,
    success: 'Ice clue unlocked! Water was hiding just below the Martian ground.',
    hint: 'Phoenix landed near the cold north pole.'
  },
  'viking-1': {
    question: 'What made Viking 1’s pictures important?',
    options: ['They showed Mars from the ground', 'They mapped Earth’s oceans'],
    answer: 0,
    success: 'Picture received! Viking helped Mars feel like a real place people could see.',
    hint: 'Imagine seeing the orange world at eye level for the first time.'
  },
  opportunity: {
    question: 'What finally stopped Opportunity?',
    options: ['A giant dust storm', 'A deep ocean'],
    answer: 0,
    success: 'Mystery solved! Dust blocked the sunlight its solar panels needed.',
    hint: 'The rover needed sunshine for power.'
  },
  'luna-9': {
    question: 'What did Luna 9 prove?',
    options: ['A craft could land gently', 'The Moon was made of cheese'],
    answer: 0,
    success: 'Landing signal confirmed! Its pictures changed what people knew about the Moon.',
    hint: 'Before Luna 9, engineers worried a lander might sink.'
  },
  'apollo-15-lrv': {
    question: 'Why did the astronauts leave the Moon buggy behind?',
    options: ['It was too heavy to bring home', 'It ran out of parking space'],
    answer: 0,
    success: 'Correct! The rover stayed on the Moon to keep the trip home light.',
    hint: 'Think about how much a car weighs.'
  },
  'apollo-12-alsep': {
    question: 'What did the ALSEP instruments keep doing after the astronauts left?',
    options: ['Listening for moonquakes', 'Driving around the Moon'],
    answer: 0,
    success: 'Signal received! The station kept measuring the Moon for years.',
    hint: 'One of its main tools was a seismometer.'
  },
  sojourner: {
    question: 'What made Sojourner special?',
    options: ['It was the first rover on Mars', 'It was the first helicopter'],
    answer: 0,
    success: 'Rover badge earned! Sojourner drove first, and every Mars rover followed.',
    hint: 'It arrived with the Pathfinder lander in 1997.'
  },
  'viking-2': {
    question: 'Where did Viking 2 land?',
    options: ['Utopia Planitia', 'The Moon'],
    answer: 0,
    success: 'Landing confirmed! Viking 2 touched down in Utopia Planitia.',
    hint: 'It was the twin of Viking 1, on the other side of Mars.'
  },
  insight: {
    question: 'What did InSight listen for?',
    options: ['Marsquakes', 'Martian songs'],
    answer: 0,
    success: 'Quake detected! InSight heard more than a thousand marsquakes.',
    hint: 'It carried a very sensitive seismometer.'
  }
}

const ids = ['apollo-11-descent-stage','apollo-11-retroreflector','surveyor-3','apollo-17-descent','spirit','ingenuity','curiosity','perseverance','phoenix','viking-1','opportunity','luna-9','apollo-15-lrv','apollo-12-alsep','sojourner','viking-2','insight']
export const stories: Story[] = ids.map((artifactId, i) => {
  const l = lines[artifactId]
  return {
    artifactId,
    letterNumber: i + 1,
    kicker: 'A machine tells its space story',
    opening: l.opening,
    beats: [
      { label: 'Meet the machine', text: l.beats[0] },
      { label: 'The big adventure', text: l.beats[1] },
      { label: 'Where it is now', text: l.beats[2] }
    ],
    humanThread: { title: 'People in the story', text: l.human },
    whyItStayed: l.why,
    closing: l.closing,
    nextId: ids[(i + 1) % ids.length],
    challenge: challenges[artifactId]
  }
})
export const storyById = Object.fromEntries(stories.map((s) => [s.artifactId, s])) as Record<string, Story>
