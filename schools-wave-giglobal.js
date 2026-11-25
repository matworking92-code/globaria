/**
 * GI Global partner campuses missing from the GlobalEd sample.
 * Loaded last so a concurrent Brazil/China wave5 edit is not overwritten.
 * New campuses only. Eight program names each. programsUrl = English-taught list.
 * No custom blurb unless blurbCustom. No per-campus halls. City halls inherit.
 */
(function () {
  const ukOverseas = "EU students without UK settled/pre-settled status pay the overseas rate.";
  const schools = [
    { id: "hs-fulda-fulda", name: "Fulda University of Applied Sciences", country: "Germany", city: "Fulda", capital: false, type: "Public",
      programs: ["BSc Global Health", "BSc International Business and Management", "BA Social Sciences for Intercultural Relations", "MSc Global Software Development", "MSc International Management", "MSc Data Science", "MA Human Rights Studies in Politics, Law and Society", "MSc International Food Business and Consumer Studies"],
      bachelor: { tuition: "€404.80 / semester contribution (WS 2026/27 on-campus, incl. Deutschlandsemesterticket; no tuition in Hesse)", tuitionEU: "€404.80 / semester contribution (WS 2026/27)", fees: "English bachelor’s and master’s listed here. Mixed German/English programs are omitted. Apply via uni-assist with international transcripts." },
      master: { tuition: "€404.80 / semester contribution (WS 2026/27 on-campus; no tuition in Hesse)", tuitionEU: "€404.80 / semester contribution (WS 2026/27)", fees: "Summer semester 2026 contribution was €386.80. Confirm the current amount on hs-fulda.de." },
      admissionsUrl: "https://www.hs-fulda.de/en/study/how-do-i-apply/application-with-international-transcripts-of-records", admissionsLabel: "Fulda international application",
      programsUrl: "https://www.hs-fulda.de/en/studyprogrammes/all-study-programmes" },
    { id: "hertie-berlin", name: "Hertie School", country: "Germany", city: "Berlin", capital: true, type: "Private",
      programs: ["Master of Public Policy (MPP)", "Master of International Affairs (MIA)", "Master of Data Science for Public Policy (MDS)", "Executive Master of Public Administration", "Dual MPP with Sciences Po", "Dual MPP/MIA Atlantis (Syracuse Maxwell)", "Dual MIA with Munk School", "Dual MDS/MPP with Duke"],
      bachelor: null,
      master: { tuition: "€38,500 total / €9,625 per semester (two-year MPP, MIA, MDS, and Executive MPA — 2026)", fees: "Graduate school only — no bachelor’s. Early-bird applications by 1 December receive €2,000 off if not replaced by a Hertie scholarship. Dual-degree partner years are billed by the host school." },
      admissionsUrl: "https://www.hertie-school.org/en/admissions", admissionsLabel: "Hertie admissions",
      programsUrl: "https://www.hertie-school.org/en/study" },
    { id: "wittenborg-apeldoorn", name: "Wittenborg University of Applied Sciences", country: "Netherlands", city: "Apeldoorn", capital: false, type: "Private",
      programs: ["BBA (IBA) Economics & Management", "BBA (IBA) Logistics & International Trade", "BBA (MCI) Marketing & Communication", "BBA (EBA) Entrepreneurship & Small Business", "MBA International Management", "MBA Applied Artificial Intelligence", "MSc/MBM Finance", "MSc/MBM Digital Transformation"],
      bachelor: { tuition: "€11,800 / year (non-EU IBA/MCI/EBA/HBA pathways)", tuitionEU: "€5,800 / year (NL, EU, UK & Ukraine)", fees: "100% English. Six intakes per year. Application via the Wittenborg apply page." },
      master: { tuition: "€21,300 total (MSc/MBM, 18–24 months); MBA €23,300 total", tuitionEU: "€21,300 total (MSc/MBM); MBA €23,300 total", fees: "MBA typically needs three years’ work experience; MSc/MBM does not. Confirm on wittenborg.eu." },
      admissionsUrl: "https://www.wittenborg.eu/apply-study-wittenborg-university.htm", admissionsLabel: "Wittenborg apply",
      programsUrl: "https://www.wittenborg.eu/choose-your-programme-and-specialisation.htm" },
    { id: "glion-montreux", name: "Glion Institute of Higher Education", country: "Switzerland", city: "Montreux", capital: false, type: "Private",
      programs: ["BSc International Hospitality Business", "BSc International Hospitality Business (Luxury Brand Strategy)", "BSc International Hospitality Business (International Hotel Development and Finance)", "BSc International Hospitality Business (Guest Experience and Event Management)", "MSc Hospitality Business Leadership", "MSc Luxury Management and Guest Experience", "MSc Hospitality, Entrepreneurship and Innovation", "MSc Real Estate, Finance and Hotel Development"],
      bachelor: { tuition: "CHF 35,000 / semester typical (2026 international BSc academic semesters; Experiential Year CHF 36,500)", tuitionEU: "CHF 22,750 / semester typical (2026 Swiss-resident BSc academic semesters — confirm glion.edu)", fees: "English throughout on the Swiss campuses (Glion/Bulle). Application CHF 275. Swiss-resident tariff needs a qualifying passport or permit — not a generic EU rate." },
      master: { tuition: "CHF 52,100 tuition for the full Switzerland MSc (2026 intakes)", tuitionEU: "CHF 33,800 typical Swiss-resident MSc tuition (2026 — confirm glion.edu)", fees: "Academic resources/trips about CHF 7,100 extra. Optional Hospitality Immersion Program is separately billed." },
      admissionsUrl: "https://www.glion.edu/apply-to-glion/", admissionsLabel: "Apply to Glion",
      programsUrl: "https://brochure.glion.edu/masters/masters-degrees" },
    { id: "rwcmd-cardiff", name: "Royal Welsh College of Music and Drama", country: "United Kingdom", city: "Cardiff", capital: false, type: "Public",
      programs: ["BA (Hons) Acting", "BA (Hons) Musical Theatre", "BMus (Hons) Music – Instrumental and Vocal", "BA (Hons) Design for Performance", "MA Acting Stage Screen & Recorded Media", "MA Musical Theatre", "MA Arts Management", "MMus Music"],
      bachelor: { tuition: "£29,500 / year (2026/27 overseas; 2027/28 overseas £30,400)", tuitionEU: "£29,500 / year (2026/27 overseas)", fees: ukOverseas + " Home undergraduates £9,790 (Welsh Government cap). Apply via UCAS Conservatoires or UCAS Undergraduate — audition required." },
      master: { tuition: "£31,200 total typical (2026/27 overseas MA Acting); MA Arts Management £26,600 FT overseas — confirm the course", tuitionEU: "£31,200 total typical (overseas MA Acting)", fees: "Audition fees extra (about £35–£63). Home postgraduate bands are lower — confirm rwcmd.ac.uk." },
      admissionsUrl: "https://www.rwcmd.ac.uk/how-to-apply", admissionsLabel: "RWCMD how to apply",
      programsUrl: "https://www.rwcmd.ac.uk/how-to-apply" },
    { id: "acd-dublin", name: "American College Dublin", country: "Ireland", city: "Dublin", capital: true, type: "Private",
      programs: ["BA (Hons) in International Business", "BA (Hons) in Liberal Arts", "BFA Performing Arts", "BFA Creative Writing", "Master of Business in International Business", "MBA", "MFA Creative Writing", "MFA Performance"],
      bachelor: { tuition: "€9,500 / year (published non-EU QQI BA (Hons) International Business and Liberal Arts)", tuitionEU: "€6,000 / year (published EU QQI BA (Hons))", fees: "English throughout. QQI honours degrees plus IAU-accredited BFA tracks. IAU BFA fees confirm the course page. Direct or CAO (AC120 / AC137)." },
      master: { tuition: "€10,000 / year (published QQI Master of Business in International Business and MBA)", tuitionEU: "€10,000 / year", fees: "QQI Level 9 Master of Business and MBA are named at €10,000. MFA tracks confirm acd.iamu.edu. Application €35." },
      admissionsUrl: "https://acd.iamu.edu/admissions/", admissionsLabel: "ACD admissions",
      programsUrl: "https://acd.iamu.edu/courses/" },
  ];

  window.GLOBALED_SCHOOLS.push(...schools);

  Object.assign(window.GLOBALED_CITIES, {
    Fulda: { country: "Germany", apartment1br: "€750 / month", apartmentNote: "Below Frankfurt; compact Hessian city.", safetyIndex: 72.0, photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80" },
    Apeldoorn: { country: "Netherlands", apartment1br: "€1,000 / month", apartmentNote: "Below Amsterdam and Utrecht.", safetyIndex: 70.0, photo: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1400&q=80" },
    Montreux: { country: "Switzerland", apartment1br: "CHF 1,750 / month", apartmentNote: "Lake Geneva; similar band to Lausanne.", safetyIndex: 78.0, photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80" },
    Cardiff: { country: "United Kingdom", apartment1br: "£950 / month", apartmentNote: "Below London; comparable to other UK regional capitals.", safetyIndex: 54.0, photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80" },
  });

  const photoList = [
    "photo-1523050854058-8df90110c9f1", "photo-1541339905348-b3b563229de5", "photo-1498243691581-b145c3f54a5a",
    "photo-1562774053-701939374585", "photo-1607237138185-eedd9c632b0c", "photo-1581091226825-a6a2a5aee158",
    "photo-1511818966892-d7d671e672a0", "photo-1551836022-d5d88e9218df", "photo-1497366754035-f200968a6e72",
    "photo-1522202176988-66273c2fd55f",
  ];
  const photos = {};
  schools.forEach((school, i) => {
    photos[school.id] = `https://images.unsplash.com/${photoList[i % photoList.length]}?auto=format&fit=crop&w=900&q=80`;
  });
  Object.assign(window.GLOBALED_PHOTOS, photos);
})();
