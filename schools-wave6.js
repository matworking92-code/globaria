/**
 * Wave 6: modest extra depth for Full high-demand countries plus Italy and China.
 * New campuses only. Eight program names each. programsUrl = English-taught list.
 * No custom blurb unless blurbCustom. No per-campus halls. City halls inherit.
 */
(function () {
  const ukOverseas = "EU students without UK settled/pre-settled status pay the overseas rate.";
  const saxony = "No tuition in Saxony — semester contribution only. Confirm the current TUD amount.";
  const nrw = "No tuition in NRW — contribution only. Confirm the current Münster amount.";

  const schools = [
    // ——— United Kingdom (21 → 24; Full, obvious Russell Group gaps) ———
    { id: "sheffield-sheffield", name: "University of Sheffield", country: "United Kingdom", city: "Sheffield", capital: false, type: "Public",
      programs: ["BSc Computer Science", "BA Business Management", "BEng Mechanical Engineering", "LLB Law", "BSc Economics", "MSc Data Science", "MSc Computer Science", "MBA"],
      bachelor: { tuition: "£25,000–£32,100 / year (2026/27 overseas undergraduate, except Medicine and Dentistry)", tuitionEU: "£25,000–£32,100 / year typical (overseas)", fees: ukOverseas + " Fixed-fee guarantee while you stay on the same course." },
      master: { tuition: "£27,000 / year typical (taught — confirm the postgraduate fee look-up)", tuitionEU: "£27,000 / year typical (overseas)", fees: "Course pages and the PGT look-up tool carry the named fee." },
      admissionsUrl: "https://sheffield.ac.uk/undergraduate/apply/application", admissionsLabel: "Sheffield how to apply",
      programsUrl: "https://sheffield.ac.uk/undergraduate/courses/search" },
    { id: "southampton-southampton", name: "University of Southampton", country: "United Kingdom", city: "Southampton", capital: false, type: "Public",
      programs: ["BSc Computer Science", "BEng Aeronautics and Astronautics", "BSc International Business", "LLB International Legal Studies", "BSc Economics", "MSc Data Science", "MSc Artificial Intelligence", "MBA"],
      bachelor: { tuition: "£28,300 / year typical (overseas classroom; Computer Science £33,000, engineering about £33,500 — confirm southampton.ac.uk course fees)", tuitionEU: "£28,300 / year typical (overseas)", fees: ukOverseas + " Overseas fees rise each year for starters from 1 August 2026." },
      master: { tuition: "£26,000–£36,300 / year typical (taught — confirm the course page)", tuitionEU: "£26,000–£36,300 / year typical (overseas)", fees: "A £2,000 CAS deposit applies for visa students on full-time courses." },
      admissionsUrl: "https://www.southampton.ac.uk/study/international", admissionsLabel: "Southampton international",
      programsUrl: "https://www.southampton.ac.uk/courses" },
    { id: "ncl-newcastle", name: "Newcastle University", country: "United Kingdom", city: "Newcastle", capital: false, type: "Public",
      programs: ["BSc Computer Science", "BA Business Management", "BEng Mechanical Engineering", "LLB Law", "BA Politics", "MSc Computer Science", "MSc Data Science", "MBA"],
      bachelor: { tuition: "£24,500 / year (2026/27 overseas classroom floor); Business about £25,750, Computer Science £31,500", tuitionEU: "£24,500 / year typical (overseas)", fees: ukOverseas + " Year-one fee; expect an inflation rise in later years." },
      master: { tuition: "£25,900–£33,250 / year typical (taught — confirm the course page)", tuitionEU: "£25,900–£33,250 / year typical (overseas)", fees: "MBA sits at the top of the taught band." },
      admissionsUrl: "https://www.ncl.ac.uk/international/", admissionsLabel: "Newcastle international",
      programsUrl: "https://www.ncl.ac.uk/undergraduate/degrees/" },

    // ——— Germany (22 → 25; Full, obvious English-master campuses) ———
    { id: "tud-dresden", name: "TU Dresden", country: "Germany", city: "Dresden", capital: false, type: "Public",
      programs: ["MSc Computer Science", "MSc Computational Modeling and Simulation", "MSc Nanoelectronic Systems", "MSc Biochemistry", "MSc Hydro Science and Engineering", "MSc Physics", "MSc Molecular Bioengineering", "MSc Electronics"],
      bachelor: null,
      master: { tuition: "€300 / semester contribution typical (no tuition — confirm tu-dresden.de)", tuitionEU: "€300 / semester contribution typical", fees: saxony },
      admissionsUrl: "https://tu-dresden.de/studium/vor-dem-studium/bewerbung?set_language=en", admissionsLabel: "TU Dresden application",
      programsUrl: "https://tu-dresden.de/studium/vor-dem-studium/studienangebot?set_language=en" },
    { id: "unimuenster-muenster", name: "University of Münster", country: "Germany", city: "Münster", capital: false, type: "Public",
      programs: ["BSc Human Movement in Sports and Exercise", "MSc Information Systems", "MSc Geoinformatics and Spatial Data Science", "MSc Geospatial Technologies", "MA National and Transnational Studies", "MSc Physics", "MSc Public Sector Innovation and eGovernance", "MA Comparative Public Governance"],
      bachelor: { tuition: "€350–€370 / semester contribution typical (no tuition — confirm uni-muenster.de)", tuitionEU: "€350–€370 / semester contribution typical", fees: nrw + " The English bachelor is Human Movement; most other bachelor’s remain German." },
      master: { tuition: "€350–€370 / semester contribution typical (no tuition — confirm uni-muenster.de)", tuitionEU: "€350–€370 / semester contribution typical", fees: nrw },
      admissionsUrl: "https://www.uni-muenster.de/studieninteressierte/en/bewerbung/", admissionsLabel: "Münster how to apply",
      programsUrl: "https://www.uni-muenster.de/ZSB/en/englischsprachige-studiengaenge.html" },
    { id: "fau-erlangen", name: "FAU Erlangen-Nürnberg", country: "Germany", city: "Erlangen", capital: false, type: "Public",
      programs: ["BSc Artificial Intelligence", "BSc International Business Studies", "BSc Clean Energy Processes", "MSc Artificial Intelligence", "MSc Data Science", "MSc Computational Engineering", "MSc International Information Systems", "MA English Studies"],
      bachelor: { tuition: "€0 tuition for first enrolment winter 2026/27; non-EU tuition from summer 2027 (€1,000–€3,000 / semester bachelor — confirm fau.eu)", tuitionEU: "Semester contribution only (about €72) until the Bavarian non-EU tuition start", fees: "Non-EU application processing €100 per program from winter 2026/27." },
      master: { tuition: "€0 tuition for first enrolment winter 2026/27; non-EU tuition from summer 2027 (€2,000–€6,000 / semester master’s — confirm fau.eu)", tuitionEU: "Semester contribution only until the Bavarian non-EU tuition start", fees: "campo.fau.de is the application portal." },
      admissionsUrl: "https://www.fau.eu/studying/international-students/application-and-enrollment-for-international-applicants/", admissionsLabel: "FAU international apply",
      programsUrl: "https://www.fau.eu/studying/degree-programs/special-ways-to-study/international-degree-programs/" },

    // ——— Canada (20 → 22; Full, obvious English-throughout gaps) ———
    { id: "uoguelph-guelph", name: "University of Guelph", country: "Canada", city: "Guelph", capital: false, type: "Public",
      programs: ["BA Arts", "BSc Science", "Bachelor of Computing", "Bachelor of Commerce", "Bachelor of Engineering", "MA Arts", "MEng Engineering", "MBA"],
      bachelor: { tuition: "CAD 44,729 / year (2026–27 incoming international Arts/Science); Computing CAD 55,915, Engineering CAD 63,160", tuitionEU: "CAD 44,729 / year typical", fees: "Compulsory fees about CAD 1,768–1,930. International tuition deposit CAD 2,000." },
      master: { tuition: "CAD 20,512 / year typical (2026–27 international Arts/Science master’s); MBA CAD 57,318", tuitionEU: "CAD 20,512 / year typical", fees: "UHIP extra. Program pages carry the named graduate band." },
      admissionsUrl: "https://admission.uoguelph.ca/international", admissionsLabel: "Guelph international apply",
      programsUrl: "https://www.uoguelph.ca/programs/" },
    { id: "mun-stjohns", name: "Memorial University", country: "Canada", city: "St. John's", capital: false, type: "Public",
      programs: ["BA Arts", "BSc Science", "BEng Engineering", "BComm Business", "BSc Computer Science", "MA Arts", "MSc Science", "MBA"],
      bachelor: { tuition: "CAD 22,500 / two semesters (2026–27 international undergraduate, 10 courses)", tuitionEU: "CAD 22,500 / two semesters typical", fees: "Application CAD 300 international. Health insurance extra." },
      master: { tuition: "CAD 9,666 typical (2026–27 international two-year master’s program cost); some professional master’s CAD 15,600", tuitionEU: "CAD 9,666 typical (program cost)", fees: "Billed by program, not always per year — confirm mun.ca." },
      admissionsUrl: "https://mun.ca/undergrad/admissions/i-want-to-apply/", admissionsLabel: "Memorial apply",
      programsUrl: "https://www.mun.ca/undergrad/programs/" },

    // ——— Italy (13 → 15; John Cabot + Trento English tracks) ———
    { id: "johncabot-rome", name: "John Cabot University", country: "Italy", city: "Rome", capital: true, type: "Private",
      programs: ["BA Business Administration", "BA International Affairs", "BA Communications", "BA Political Science", "BA Marketing", "BA English Literature", "MA International Affairs", "MA Art History"],
      bachelor: { tuition: "€22,700 / year (Fall 2026–Spring 2027 full-time, 10–17 credits, billed in euros)", fees: "Application €50. Tuition includes a €320 student activity fee. CISI insurance extra for visa students." },
      master: { tuition: "€20,000 typical (MA International Affairs — confirm johncabot.edu)", fees: "USD billing is a separate published COA. Apply via the JCU portal or Common App." },
      admissionsUrl: "https://www.johncabot.edu/admissions", admissionsLabel: "John Cabot admissions",
      programsUrl: "https://www.johncabot.edu/" },
    { id: "unitn-trento", name: "University of Trento", country: "Italy", city: "Trento", capital: false, type: "Public",
      programs: ["BSc Computer Science", "BSc Economics and Management", "BA Comparative, European and International Legal Studies", "MSc Computer Science", "MSc Artificial Intelligence Systems", "MSc International Management", "MSc Data Science", "MA European and International Studies"],
      bachelor: { tuition: "Merit-banded, typically €0–€4,500 / year (2026/27 non-EU English Economics & Management by admission score; Computer Science max €3,000 — confirm unitn.it)", tuitionEU: "ISEE-banded — confirm unitn.it", fees: "Non-EU first-year fee follows the admission-score table. Application about €30 on some calls." },
      master: { tuition: "Merit-banded, typically €0–€6,500 / year (non-EU English master’s by admission score; some calls cap near €10,000 — confirm unitn.it)", tuitionEU: "ISEE-banded — confirm unitn.it", fees: "Calls open December–March for non-EU applicants living abroad." },
      admissionsUrl: "https://www.unitn.it/en/admission-courses-taught-english", admissionsLabel: "UniTrento English apply",
      programsUrl: "https://www.unitn.it/en/admission-courses-taught-english" },

    // ——— China (11 → 12; Solid, English-medium joint campus) ———
    { id: "bnbu-zhuhai", name: "BNBU (UIC Zhuhai)", country: "China", city: "Zhuhai", capital: false, type: "Public",
      programs: ["BBA Finance", "BBA Accounting", "BBA Marketing Management", "BSc Computer Science and Technology", "BSc Statistics", "BSc Applied Economics", "BSc Artificial Intelligence", "BA English Language and Literature Studies"],
      bachelor: { tuition: "RMB 110,000 / year (international undergraduate; Musical Arts RMB 132,000 — confirm ido.uic.edu.cn)", fees: "English throughout. Dual BNBU / Hong Kong Baptist University award. Accommodation about RMB 4,000–6,400 / nine months." },
      master: null,
      admissionsUrl: "https://admission.bnbu.edu.cn/ido/how_to_apply.htm", admissionsLabel: "BNBU international apply",
      programsUrl: "https://admission.bnbu.edu.cn/ido/programmes_courses.htm" },
  ];

  window.GLOBALED_SCHOOLS.push(...schools);

  Object.assign(window.GLOBALED_COUNTRIES, {
    Italy: {
      safetyIndex: 52.7,
      region: "Europe",
      blurb: "Solid-to-full English set — not every Italian campus. Public fees are income-banded; Bocconi, Luiss, and John Cabot are the English private contrast. Trento adds a dense English bachelor and master’s list.",
      photo: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80",
    },
    China: {
      safetyIndex: 76.0,
      region: "Asia",
      blurb: "Solid listing of English-medium joint campuses and English master’s at the flagships — not a complete national directory. NYU Shanghai, DKU, XJTLU, UNNC, CUHK-Shenzhen, Wenzhou-Kean, and BNBU (UIC Zhuhai) teach bachelor’s in English; Tsinghua, Peking, Fudan, Zhejiang, and SJTU are listed mainly for English graduate degrees.",
      photo: "https://images.unsplash.com/photo-1548919973-5b8a7d454f2a?auto=format&fit=crop&w=1400&q=80",
    },
  });

  Object.assign(window.GLOBALED_CITIES, {
    Sheffield: { country: "United Kingdom", apartment1br: "£850 / month", apartmentNote: "Below Manchester; comparable to Leeds.", safetyIndex: 48.0, photo: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80" },
    Southampton: { country: "United Kingdom", apartment1br: "£1,050 / month", apartmentNote: "Below London; comparable to Bristol.", safetyIndex: 54.0, photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80" },
    Newcastle: { country: "United Kingdom", apartment1br: "£850 / month", apartmentNote: "Below London and Edinburgh; not Newcastle AU.", safetyIndex: 50.0, photo: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1400&q=80" },
    Dresden: { country: "Germany", apartment1br: "€750 / month", apartmentNote: "Below Munich and Berlin.", safetyIndex: 68.0, photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80" },
    Münster: { country: "Germany", apartment1br: "€850 / month", apartmentNote: "Student-city demand is tight.", safetyIndex: 74.0, photo: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80" },
    Erlangen: { country: "Germany", apartment1br: "€800 / month", apartmentNote: "Below Munich; Nuremberg is next door.", safetyIndex: 72.0, photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80" },
    Guelph: { country: "Canada", apartment1br: "CAD 1,650 / month", apartmentNote: "Below Toronto; comparable to Hamilton.", safetyIndex: 62.0, photo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80" },
    "St. John's": { country: "Canada", apartment1br: "CAD 1,350 / month", apartmentNote: "Below Halifax and Toronto. Newfoundland capital.", safetyIndex: 64.0, photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80" },
    Trento: { country: "Italy", apartment1br: "€800 / month", apartmentNote: "Below Milan; Alpine university city.", safetyIndex: 72.0, photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80" },
    Zhuhai: { country: "China", apartment1br: "CNY 4,200 / month", apartmentNote: "Below Shenzhen; Greater Bay campus city.", safetyIndex: 68.0, photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80" },
  });

  const photoList = [
    "photo-1523050854058-8df90110c9f1", "photo-1541339905348-b3b563229de5", "photo-1498243691581-b145c3f54a5a",
    "photo-1562774053-701939374585", "photo-1607237138185-eedd9c632b0c", "photo-1581091226825-a6a2a5aee158",
    "photo-1511818966892-d7d671e672a0", "photo-1551836022-d5d88e9218df", "photo-1497366754035-f200968a6e72",
    "photo-1522202176988-66273c2fd55f", "photo-1506905925346-21bda4d32df4",
  ];
  const photos = {};
  schools.forEach((school, i) => {
    photos[school.id] = `https://images.unsplash.com/${photoList[i % photoList.length]}?auto=format&fit=crop&w=900&q=80`;
  });
  Object.assign(window.GLOBALED_PHOTOS, photos);
})();
