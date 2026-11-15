// Official NASA Space Apps 2026 challenge resources, mapped to verified records.
// Source list: https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/?tab=resources
// Records checked against NSSDCA and NASA Science on 2026-11-13.

export type ResourceGroup = 'moon' | 'mars' | 'deep'

export type Placement = 'surface' | 'inactive' | 'orbiting' | 'travelling' | 'active'

export interface ResourceSource {
  label: string
  url: string
}

export interface NasaResource {
  id: string
  name: string
  shortName: string
  group: ResourceGroup
  kind: string
  launched: string
  destination: string
  purpose: string
  whySent: string
  status: string
  placement: Placement
  location: string
  instruments: string[]
  discoveries: string[]
  ended: string
  legacy: string
  /** Clearly-labelled imagined voice. Not a real transmission or quotation. */
  story: string
  sources: ResourceSource[]
  nssdca?: ResourceSource
  /** Comic field-guide entries that tell this machine's story. */
  artifactIds: string[]
  verified: string
}

export const GROUP_LABEL: Record<ResourceGroup, string> = {
  moon: 'The Moon',
  mars: 'Mars',
  deep: 'Deep space'
}

export const PLACEMENT_LABEL: Record<Placement, string> = {
  surface: 'On a surface',
  inactive: 'Inactive on a surface',
  orbiting: 'Still in orbit',
  travelling: 'Travelling outward',
  active: 'Active'
}

const VERIFIED = '2026-11-13'

export const nasaResources: NasaResource[] = [
  {
    id: 'apollo-lunar-modules',
    name: 'Apollo Lunar Modules',
    shortName: 'Apollo landers',
    group: 'moon',
    kind: 'Crewed lunar lander (descent stage)',
    launched: '1969–1972 · Apollo 11, 12, 14, 15, 16 and 17',
    destination: 'The Moon',
    purpose: 'Land two astronauts on the Moon, then act as the launch platform for the trip home.',
    whySent:
      'Apollo needed a spacecraft that could touch down softly, carry everything the crew needed, and lift off again in lunar gravity.',
    status: 'Left on the surface. Inactive.',
    placement: 'surface',
    location:
      'Six descent stages remain at their landing sites, including Tranquility Base (Apollo 11), Fra Mauro (14), Hadley–Apennine (15), Descartes Highlands (16) and Taurus–Littrow (17). Apollo 13 did not land.',
    instruments: [
      'Descent engine and propellant tanks',
      'Four landing legs with footpads',
      'Scientific payloads on later missions, carried alongside the ALSEP'
    ],
    discoveries: [
      'Apollo crews returned 382 kg of lunar samples between 1969 and 1972',
      'The descent stages are visible from lunar orbit and still mark each landing site'
    ],
    ended:
      'Each descent stage was deliberately left behind: leaving its mass on the Moon made the ascent stage lighter and the trip home safer.',
    legacy:
      'They are the launch pads of the first human visits to another world, and the hardware around the most famous footprints in history.',
    story:
      'I carried people down to another world. When they left, I stayed — not because I failed, but because staying was the plan. I am the pad the first Moonwalkers launched from.',
    sources: [
      { label: 'NASA · Apollo 11 mission', url: 'https://www.nasa.gov/mission/apollo-11/' },
      { label: 'Apollo Lunar Surface Journal', url: 'https://www.nasa.gov/history/alsj/' }
    ],
    nssdca: {
      label: 'NSSDCA · Apollo 11 Lunar Module Eagle',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C'
    },
    artifactIds: ['apollo-11-descent-stage', 'apollo-17-descent'],
    verified: VERIFIED
  },
  {
    id: 'lunar-roving-vehicles',
    name: 'Lunar Roving Vehicles (LRVs)',
    shortName: 'Moon buggies',
    group: 'moon',
    kind: 'Battery-electric lunar rover',
    launched: '1971–1972 · Apollo 15, 16 and 17',
    destination: 'The Moon',
    purpose: 'Let astronauts drive across the Moon with tools, cameras and samples instead of walking everywhere.',
    whySent:
      'The last three Apollo crews needed to cover far more ground than a walking astronaut could manage in a few days.',
    status: 'Parked on the Moon. Inactive.',
    placement: 'surface',
    location:
      'Apollo 15 at Hadley–Apennine, Apollo 16 at the Descartes Highlands, and Apollo 17 at Taurus–Littrow.',
    instruments: [
      'Four wire-mesh wheels with separate motors',
      'Hand controllers for both crew members',
      'Television camera on Apollo 16 and 17',
      'Carriers for tools, sample bags and experiments'
    ],
    discoveries: [
      'Extended each mission’s range to tens of kilometres',
      'Let crews sample rocks from several different landscapes in one visit'
    ],
    ended:
      'Each rover was parked at the end of its mission so the ascent stage could carry the crew and samples home.',
    legacy:
      'They proved that driving on another world multiplies what explorers can accomplish in a single visit.',
    story:
      'I was built for three days of driving, and I never came home. My wheels are still pointed at the hills I helped people reach.',
    sources: [
      { label: 'Apollo Lunar Surface Journal · LRV', url: 'https://www.nasa.gov/history/alsj/' }
    ],
    artifactIds: ['apollo-17-descent'],
    verified: VERIFIED
  },
  {
    id: 'alsep',
    name: 'ALSEP Scientific Packages',
    shortName: 'ALSEP stations',
    group: 'moon',
    kind: 'Apollo Lunar Surface Experiments Package',
    launched: '1969–1972 · Apollo 12, 14, 15, 16 and 17',
    destination: 'The Moon',
    purpose: 'Keep doing science after the astronauts left: listening for moonquakes, measuring heat, solar wind and the lunar interior.',
    whySent:
      'A crewed visit lasts days. A station on the surface can keep recording for years, sending data back by radio.',
    status: 'Inactive, apart from retroreflector arrays that still return laser pulses.',
    placement: 'inactive',
    location: 'Five ALSEP stations remain at their Apollo landing sites. Apollo 11 carried a smaller early version, the EASEP.',
    instruments: [
      'Passive and active seismometers',
      'Laser retroreflector arrays',
      'Magnetometers',
      'Heat-flow probes',
      'Solar-wind spectrometers'
    ],
    discoveries: [
      'Recorded thousands of moonquakes, including deep quakes from inside the Moon',
      'Measured heat flowing out of the lunar interior',
      'Showed the Moon has a small core'
    ],
    ended:
      'The stations were switched off between 1977 and 1978 as funding for the network ended. Some instruments failed earlier in the lunar night.',
    legacy:
      'ALSEP founded lunar seismology, and its retroreflectors still measure the Earth–Moon distance today.',
    story:
      'The astronauts left, and I kept listening. For years I felt the Moon move under me and told Earth about every tremor.',
    sources: [
      { label: 'Apollo Lunar Surface Journal · ALSEP', url: 'https://www.nasa.gov/history/alsj/' }
    ],
    nssdca: {
      label: 'NSSDCA · Apollo 11 experiments',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C'
    },
    artifactIds: ['apollo-11-retroreflector'],
    verified: VERIFIED
  },
  {
    id: 'surveyor',
    name: 'Surveyor Landers',
    shortName: 'Surveyor',
    group: 'moon',
    kind: 'Robotic lunar lander',
    launched: '1966–1968 · Surveyor 1 to 7',
    destination: 'The Moon',
    purpose: 'Prove that a spacecraft could land softly on the Moon and study the surface before Apollo crews arrived.',
    whySent:
      'Engineers did not yet know whether lunar dust would swallow a lander. Surveyor had to test the ground itself.',
    status: 'Inactive. Five of the seven missions landed successfully.',
    placement: 'inactive',
    location:
      'Surveyor 1, 3, 5, 6 and 7 landed. Surveyor 3 rests in Oceanus Procellarum at 3.0162°S, 23.418°W, where Apollo 12 astronauts visited it.',
    instruments: [
      'Television camera',
      'Soil-mechanics surface sampler on Surveyor 3 and 7',
      'Alpha-scattering instrument on Surveyor 5, 6 and 7',
      'Magnets on the footpads'
    ],
    discoveries: [
      'Showed the lunar surface was firm enough to support a lander',
      'Measured the strength, texture and chemistry of lunar soil',
      'Surveyor 3 alone returned more than 6,000 photographs'
    ],
    ended:
      'The landers relied on batteries and could not survive the cold lunar night. Surveyor 3 fell silent in May 1967.',
    legacy:
      'Surveyor cleared the way for the first human landings, and Surveyor 3 became the first spacecraft visited by people on another world.',
    story:
      'I landed first, when nobody was sure the ground would hold. I tested the dust so the astronauts would not have to guess.',
    sources: [
      { label: 'NASA JPL · Surveyor 3', url: 'https://www.jpl.nasa.gov/missions/surveyor-3' }
    ],
    nssdca: {
      label: 'NSSDCA · Surveyor 3',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A'
    },
    artifactIds: ['surveyor-3'],
    verified: VERIFIED
  },
  {
    id: 'sojourner',
    name: 'Sojourner Rover',
    shortName: 'Sojourner',
    group: 'mars',
    kind: 'Microrover',
    launched: '4 December 1996 · landed 4 July 1997',
    destination: 'Mars · Ares Vallis',
    purpose: 'Drive a small rover off the Pathfinder lander and test mobile robot exploration on Mars.',
    whySent:
      'Pathfinder was a low-cost mission to prove that airbags, a small lander and a rover could work together on Mars.',
    status: 'Permanently parked beside the Pathfinder lander. Inactive.',
    placement: 'inactive',
    location: 'Ares Vallis, Mars, at the Pathfinder landing site.',
    instruments: [
      'Alpha Proton X-ray Spectrometer',
      'Forward and rear cameras',
      'Wheel odometry and hazard sensors'
    ],
    discoveries: [
      'Measured the chemistry of rocks and soil at Ares Vallis',
      'Demonstrated that a lightweight rover could navigate Martian terrain'
    ],
    ended:
      'Sojourner’s last data arrived on 27 September 1997. The mission ended on 10 March 1998 after the lander’s power system failed.',
    legacy:
      'The first rover on Mars proved that mobile robots belong on other worlds and set the pattern for every rover since.',
    story:
      'I was a microwave-oven-sized explorer with six wheels and one summer. I drove away from my lander and showed that robots could roam another planet.',
    sources: [
      { label: 'NASA Science · Mars Pathfinder', url: 'https://science.nasa.gov/mission/mars-pathfinder/' }
    ],
    nssdca: {
      label: 'NSSDCA · Mars Pathfinder',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A'
    },
    artifactIds: [],
    verified: VERIFIED
  },
  {
    id: 'spirit-opportunity',
    name: 'Spirit & Opportunity',
    shortName: 'Twin rovers',
    group: 'mars',
    kind: 'Mars Exploration Rovers',
    launched: '2003 · Spirit 10 June, Opportunity 7 July',
    destination: 'Mars · Gusev Crater and Meridiani Planum',
    purpose: 'Search for evidence that liquid water once flowed on Mars.',
    whySent:
      'Orbiters had spotted minerals that form in water. The twin rovers were sent to examine those clues on the ground.',
    status: 'Both inactive on the surface.',
    placement: 'inactive',
    location: 'Spirit rests in Gusev Crater. Opportunity rests in Perseverance Valley, Meridiani Planum.',
    instruments: [
      'Panoramic and microscopic cameras',
      'Mössbauer spectrometer',
      'Alpha Particle X-ray Spectrometer',
      'Rock abrasion tool'
    ],
    discoveries: [
      'Found minerals and rock layers formed in ancient water',
      'Opportunity drove 45.16 km, farther than any rover on another world'
    ],
    ended:
      'Spirit’s last contact was in March 2010 after its wheels became trapped. Opportunity’s last contact was in June 2018 after a planet-wide dust storm; NASA declared the mission over in February 2019.',
    legacy:
      'Planned for 90 days, they explored for years and turned “water on ancient Mars” from a suspicion into a field of study.',
    story:
      'We were twins built for ninety days. I kept rolling for fifteen years, and my sister climbed hills until her wheels stopped.',
    sources: [
      { label: 'NASA Science · Spirit', url: 'https://science.nasa.gov/mission/mer-spirit/' },
      { label: 'NASA Science · Opportunity', url: 'https://science.nasa.gov/mission/mer-opportunity/' }
    ],
    nssdca: {
      label: 'NSSDCA · Spirit (MER-A)',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A'
    },
    artifactIds: ['spirit', 'opportunity'],
    verified: VERIFIED
  },
  {
    id: 'viking-landers',
    name: 'Viking 1 & 2 Landers',
    shortName: 'Viking landers',
    group: 'mars',
    kind: 'Orbiter and lander pairs',
    launched: '1975 · Viking 1 on 20 August, Viking 2 on 9 September',
    destination: 'Mars · Chryse Planitia and Utopia Planitia',
    purpose: 'Photograph the Martian surface, study its weather and soil, and search for signs of life.',
    whySent:
      'Viking was NASA’s first attempt to land on Mars and its first dedicated search for life on another planet.',
    status: 'Landers inactive on the surface; orbiters inactive.',
    placement: 'inactive',
    location: 'Viking 1 rests in Chryse Planitia. Viking 2 rests in Utopia Planitia.',
    instruments: [
      'Surface cameras',
      'Gas chromatograph–mass spectrometer',
      'Three biology experiments',
      'Weather station',
      'Seismometer'
    ],
    discoveries: [
      'Sent the first clear pictures from the Martian surface',
      'Measured the atmosphere, weather and soil chemistry',
      'Life-detection results were ambiguous, and no conclusive evidence of life was found'
    ],
    ended:
      'Viking 2’s last data arrived in April 1980. Viking 1 continued until November 1982, when a command error ended contact.',
    legacy:
      'The first U.S. landers to operate on Mars, and the first mission to look for life there.',
    story:
      'I landed on a world that had only been seen from far away. The first picture I sent showed people an orange sky and rocks at their feet.',
    sources: [
      { label: 'NASA Science · Viking 1', url: 'https://science.nasa.gov/mission/viking-1/' },
      { label: 'NASA Science · Viking 2', url: 'https://science.nasa.gov/mission/viking-2/' }
    ],
    nssdca: {
      label: 'NSSDCA · Viking 1 Lander',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C'
    },
    artifactIds: ['viking-1'],
    verified: VERIFIED
  },
  {
    id: 'phoenix-insight',
    name: 'Phoenix & InSight Landers',
    shortName: 'Phoenix & InSight',
    group: 'mars',
    kind: 'Stationary science landers',
    launched: 'Phoenix 2007 · InSight 2018',
    destination: 'Mars · northern plains and Elysium Planitia',
    purpose:
      'Phoenix dug for water ice near the north pole. InSight listened for marsquakes and studied the planet’s interior.',
    whySent:
      'One mission asked where the water went; the other asked what Mars is made of beneath the surface.',
    status: 'Both inactive on the surface.',
    placement: 'inactive',
    location: 'Phoenix rests on the northern plains at about 68°N. InSight rests in Elysium Planitia.',
    instruments: [
      'Phoenix: robotic arm, thermal and gas analyzer, cameras',
      'InSight: seismometer, heat-flow probe, radio-science experiment',
      'InSight: weather sensors'
    ],
    discoveries: [
      'Phoenix confirmed water ice just below the surface and observed falling snow',
      'InSight recorded more than 1,300 marsquakes and revealed the size of Mars’s core'
    ],
    ended:
      'Phoenix lost power in the dark Martian winter; its last contact was in November 2008. InSight’s dust-covered solar panels failed, and its last contact was in December 2022.',
    legacy:
      'They turned water ice and marsquakes from ideas into measured, mapped phenomena.',
    story:
      'One of us scraped the ground and found ice. The other pressed an ear to the planet and heard it rumble. Both of us went quiet when the power ran out.',
    sources: [
      { label: 'NASA Science · Phoenix', url: 'https://science.nasa.gov/mission/phoenix/' },
      { label: 'NASA Science · InSight', url: 'https://science.nasa.gov/mission/insight/' }
    ],
    nssdca: {
      label: 'NSSDCA · Phoenix',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A'
    },
    artifactIds: ['phoenix'],
    verified: VERIFIED
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity',
    group: 'mars',
    kind: 'Solar-powered helicopter',
    launched: '30 July 2020 · landed 18 February 2021',
    destination: 'Mars · Jezero Crater',
    purpose: 'Prove that powered, controlled flight is possible in the thin Martian atmosphere.',
    whySent:
      'It flew as a technology demonstration tucked under Perseverance, with a plan for up to five flights in 30 days.',
    status: 'Stationary on Mars after rotor damage. Mission complete.',
    placement: 'inactive',
    location: 'Its final airfield in Jezero Crater, Mars.',
    instruments: [
      'Two cameras (navigation and colour)',
      'Solar panel and battery',
      'Counter-rotating carbon-fibre rotor blades',
      'Flight computer'
    ],
    discoveries: [
      'Made the first powered flight on another planet on 19 April 2021',
      'Completed 72 flights instead of the five planned',
      'Scouted terrain and tested aerial exploration for future missions'
    ],
    ended:
      'Its 72nd flight was on 18 January 2024. Rotor blades were damaged during touchdown, and NASA announced the end of the mission on 25 January 2024.',
    legacy:
      'The first aircraft on another world opened the sky to exploration.',
    story:
      'I was supposed to fly five times. I flew seventy-two. My blades are broken now, but I am still the first aircraft on another planet.',
    sources: [
      { label: 'NASA JPL · Ingenuity mission ends', url: 'https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends' },
      { label: 'NASA · Mars helicopter', url: 'https://mars.nasa.gov/technology/helicopter/' }
    ],
    nssdca: {
      label: 'NSSDCA · Perseverance (carried Ingenuity)',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A'
    },
    artifactIds: ['ingenuity'],
    verified: VERIFIED
  },
  {
    id: 'dawn',
    name: 'Dawn Spacecraft',
    shortName: 'Dawn',
    group: 'deep',
    kind: 'Ion-propelled orbiter',
    launched: '27 September 2007',
    destination: 'Asteroid belt · Vesta and Ceres',
    purpose: 'Orbit and map the two largest bodies in the main asteroid belt.',
    whySent:
      'Vesta and Ceres are leftovers from the solar system’s formation, and Dawn’s ion engine made it possible to orbit both.',
    status: 'Out of fuel and silent, but still in orbit around Ceres.',
    placement: 'orbiting',
    location: 'In a long-lived orbit around the dwarf planet Ceres. Communications ended on 31 October 2018.',
    instruments: [
      'Framing camera',
      'Visible and infrared spectrometer',
      'Gamma-ray and neutron detector',
      'Gravity science using radio tracking'
    ],
    discoveries: [
      'First spacecraft to orbit two extraterrestrial bodies',
      'Mapped Vesta and Ceres in detail',
      'Found bright salt deposits in Occator Crater on Ceres'
    ],
    ended:
      'Dawn ran out of hydrazine, the fuel it used to point its antenna and solar panels. NASA declared the mission over on 1 November 2018.',
    legacy:
      'It showed that ion propulsion can tour the asteroid belt and turned two ancient worlds into places we know.',
    story:
      'I visited two worlds in one journey. I have no fuel left to call home, so I circle Ceres in silence, still falling around the world I mapped.',
    sources: [
      { label: 'NASA Science · Dawn', url: 'https://science.nasa.gov/mission/dawn/' },
      { label: 'NASA · Dawn end of mission', url: 'https://science.nasa.gov/mission/dawn/toolkit/end-of-mission' }
    ],
    nssdca: {
      label: 'NSSDCA · Dawn',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A'
    },
    artifactIds: [],
    verified: VERIFIED
  },
  {
    id: 'near-shoemaker',
    name: 'NEAR Shoemaker',
    shortName: 'NEAR Shoemaker',
    group: 'deep',
    kind: 'Asteroid orbiter and lander',
    launched: '17 February 1996',
    destination: 'Asteroid 433 Eros',
    purpose: 'Orbit and study a near-Earth asteroid, then attempt a controlled landing.',
    whySent:
      'Eros is a leftover building block of the planets, and NEAR was the first mission to study one up close for a full year.',
    status: 'At rest on the surface of Eros. Inactive.',
    placement: 'surface',
    location: 'On asteroid 433 Eros, where it touched down on 12 February 2001.',
    instruments: [
      'Multi-spectral imager',
      'Near-infrared spectrometer',
      'X-ray and gamma-ray spectrometer',
      'Magnetometer',
      'Laser rangefinder'
    ],
    discoveries: [
      'First spacecraft to orbit an asteroid',
      'First spacecraft to land on an asteroid',
      'Mapped Eros and measured its composition and gravity'
    ],
    ended:
      'NEAR made a controlled descent to Eros on 12 February 2001 and kept sending data for about two weeks. The mission ended on 28 February 2001.',
    legacy:
      'It proved that asteroids can be orbited and touched, paving the way for sample-return missions.',
    story:
      'I was not built to land. At the end of my mission I was told to try anyway, and I settled onto Eros and kept talking for two more weeks.',
    sources: [
      { label: 'NASA Science · NEAR Shoemaker', url: 'https://science.nasa.gov/mission/near-shoemaker/' }
    ],
    nssdca: {
      label: 'NSSDCA · NEAR Shoemaker',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A'
    },
    artifactIds: [],
    verified: VERIFIED
  },
  {
    id: 'pioneer-10-11',
    name: 'Pioneer 10 & 11',
    shortName: 'Pioneer 10 & 11',
    group: 'deep',
    kind: 'Outer-planet flyby probes',
    launched: 'Pioneer 10 on 2 March 1972 · Pioneer 11 on 5 April 1973',
    destination: 'Jupiter, Saturn and beyond',
    purpose: 'Be the first spacecraft to cross the asteroid belt and fly past the outer planets.',
    whySent:
      'Nobody knew whether the asteroid belt could be crossed safely, or what Jupiter’s radiation would do to a spacecraft.',
    status: 'Both silent and travelling outward through interstellar space.',
    placement: 'travelling',
    location:
      'Pioneer 10 is heading toward the constellation Taurus; Pioneer 11 toward Aquila. Their last signals reached Earth in 2003 and 1995.',
    instruments: [
      'Imaging photopolarimeter',
      'Magnetometer',
      'Plasma analyzer',
      'Cosmic-ray telescope',
      'Meteoroid detector'
    ],
    discoveries: [
      'Pioneer 10 was the first spacecraft to cross the asteroid belt',
      'Pioneer 10 made the first flyby of Jupiter; Pioneer 11 the first of Saturn',
      'Both carried plaques describing their makers to the stars'
    ],
    ended:
      'Pioneer 11’s last contact was in September 1995. Pioneer 10’s last signal was in January 2003, when its power source could no longer run the transmitter.',
    legacy:
      'They scouted the outer solar system for Voyager and became humanity’s first departing messengers.',
    story:
      'I left Earth before anyone knew if the asteroid belt could be crossed. I kept going, past Jupiter and Saturn, and I am still going.',
    sources: [
      { label: 'NASA Science · Pioneer 10', url: 'https://science.nasa.gov/mission/pioneer-10/' },
      { label: 'NASA Science · Pioneer 11', url: 'https://science.nasa.gov/mission/pioneer-11/' }
    ],
    nssdca: {
      label: 'NSSDCA · Pioneer 10',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A'
    },
    artifactIds: [],
    verified: VERIFIED
  },
  {
    id: 'kepler',
    name: 'Kepler Space Telescope',
    shortName: 'Kepler',
    group: 'deep',
    kind: 'Exoplanet-hunting space telescope',
    launched: '6 March 2009',
    destination: 'Heliocentric Earth-trailing orbit',
    purpose: 'Watch thousands of stars for tiny dips in brightness caused by planets passing in front of them.',
    whySent:
      'Before Kepler, astronomers knew of only a few hundred exoplanets. Kepler was built to find out how common planets really are.',
    status: 'Retired and drifting in an Earth-trailing orbit.',
    placement: 'orbiting',
    location: 'A heliocentric orbit that trails Earth. It ran out of fuel and was retired on 30 October 2018.',
    instruments: [
      '95-megapixel photometer',
      'Reaction wheels for pointing (two failed during the mission)'
    ],
    discoveries: [
      'Confirmed more than 2,600 planets outside our solar system',
      'Showed that small, rocky planets are common',
      'Found planets in the habitable zones of their stars'
    ],
    ended:
      'Kepler ran out of fuel in 2018, so it could no longer point at its target stars. NASA retired the telescope on 30 October 2018.',
    legacy:
      'It changed our picture of planetary systems and made the search for another Earth a mainstream science.',
    story:
      'I stared at one patch of sky for years, waiting for tiny dips in starlight. Each dip was a world passing in front of its sun.',
    sources: [
      { label: 'NASA Science · Kepler', url: 'https://science.nasa.gov/mission/kepler/' }
    ],
    nssdca: {
      label: 'NSSDCA · Kepler',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A'
    },
    artifactIds: [],
    verified: VERIFIED
  },
  {
    id: 'nssdca',
    name: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    shortName: 'NSSDCA',
    group: 'deep',
    kind: 'NASA mission and data archive',
    launched: 'Not a spacecraft — an archive maintained by NASA',
    destination: 'Everywhere NASA has sent a spacecraft',
    purpose:
      'Search spacecraft and instruments, retrieve mission parameters, and find each mission’s final location and operational status.',
    whySent:
      'It is NASA’s definitive public catalog for space science missions, experiments and data sets.',
    status: 'Online and maintained by NASA.',
    placement: 'active',
    location: 'NASA Goddard Space Flight Center, Greenbelt, Maryland.',
    instruments: [],
    discoveries: [
      'Master Catalog records for missions from Ranger and Surveyor to Dawn and Kepler',
      'Experiment and data-set records linked to each spacecraft'
    ],
    ended: 'Not applicable — the archive is an ongoing NASA service.',
    legacy:
      'It is the primary source this site uses to check identities, launch details, status and final locations.',
    story:
      'I do not travel. I remember. Every spacecraft NASA has sent is written down somewhere in me, including the ones that never came home.',
    sources: [
      { label: 'NSSDCA · Master Catalog', url: 'https://nssdc.gsfc.nasa.gov/' }
    ],
    artifactIds: [],
    verified: VERIFIED
  }
]

export const resourceGroups: { id: 'all' | ResourceGroup; label: string }[] = [
  { id: 'all', label: 'All resources' },
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'deep', label: 'Deep space' }
]

export const resourceById = Object.fromEntries(nasaResources.map((r) => [r.id, r])) as Record<
  string,
  NasaResource
>
