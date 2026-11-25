/**
 * Wave 5: Solid-ish Brazil and China English-taught campuses.
 * New campuses only (plus a data refresh of the existing FGV EAESP / NYU Shanghai / DKU rows).
 * Eight program names each. programsUrl = English-taught list.
 * No custom blurb unless blurbCustom. No per-campus halls. City halls inherit.
 */
(function () {
  const schools = [
    // ——— Brazil ———
    { id: "fgv-ebape-rio", name: "FGV EBAPE", country: "Brazil", city: "Rio de Janeiro", capital: false, type: "Private",
      programs: ["Master in Management (MiM)", "MiM Double Degree (Católica-Lisbon)", "MiM Double Degree (ESCP)", "MiM Double Degree (Montpellier)", "MiM Double Degree (NHH)", "MSc Administration (Behavioral & Decision Science)", "MSc Administration (Strategy, Management, and Organizations)", "MSc Administration (Finance)"],
      bachelor: null,
      master: { tuition: "BRL 83,633 typical (2026 MiM single payment; 15 instalments BRL 85,885.05). Academic MSc confirm ebape.fgv.br", fees: "English master’s; the bilingual BSc in Administration is not listed as a full English bachelor. Application fee extra." },
      admissionsUrl: "https://ebape.fgv.br/en/courses/professional-masters/master-management-mim/admission-process", admissionsLabel: "EBAPE MiM admission",
      programsUrl: "https://ebape.fgv.br/en/internationalization/programs" },
    { id: "coppead-ufrj-rio", name: "COPPEAD / UFRJ", country: "Brazil", city: "Rio de Janeiro", capital: false, type: "Public",
      programs: ["Full-Time MBA", "MSc Administration (Full-Time MBA award)", "MBA (Decision-making, Behavior, and Ethics)", "MBA (Business Administration and Economy)", "MBA (Training, Growth and Transformation of Business)", "MBA Exchange Module", "MBA Internship track", "MBA Multicultural Projects"],
      bachelor: null,
      master: { tuition: "BRL 0 / year (tuition-free UFRJ stricto sensu master’s — confirm coppead.ufrj.br)", fees: "English Full-Time MBA. Some electives may be in Portuguese. CAPES/CNPq living grants are separate from tuition." },
      admissionsUrl: "https://www.coppead.ufrj.br/full-time-mba/", admissionsLabel: "COPPEAD Full-Time MBA",
      programsUrl: "https://www.coppead.ufrj.br/full-time-mba/" },
    { id: "skema-belohorizonte", name: "SKEMA Business School", country: "Brazil", city: "Belo Horizonte", capital: false, type: "Private",
      programs: ["Global BBA Bachelor in Management", "Global BBA (Global Business)", "Master in Management", "Two-Year MSc", "MSc Corporate Financial Management", "MSc International Marketing and Business Development", "MSc Corporate Financial Management (Financial Risk Management)", "MSc International Business"],
      bachelor: { tuition: "€14,000 / year (Global BBA) plus about €500 service / year — confirm skema.edu", fees: "French-accredited English campus in Belo Horizonte, not a Brazilian-public fee. Apply via MySKEMA." },
      master: { tuition: "€37,000 for two years (Master in Management); two-year MSc €38,000 typical (some specialisations €41,000–€47,000) — confirm skema.edu", fees: "Application about €100. Specialisations can move campus in year two." },
      admissionsUrl: "https://www.skema.edu/en/programmes/global-bba", admissionsLabel: "SKEMA Global BBA apply",
      programsUrl: "https://www.skema.edu/en/programmes/master-science-msc" },

    // ——— China ———
    { id: "xjtlu-suzhou", name: "Xi’an Jiaotong-Liverpool University", country: "China", city: "Suzhou", capital: false, type: "Private",
      programs: ["BSc Computer Science and Technology", "BA Business Administration", "BEng Architecture", "BSc Economics and Finance", "MSc Artificial Intelligence", "MSc Finance", "MSc Data Science", "MSc Management"],
      bachelor: { tuition: "RMB 93,000 / year (2026 international undergraduate)", fees: "English throughout. Dual XJTLU / University of Liverpool award. Early-bird discount if complete by 15 April 2026." },
      master: { tuition: "RMB 100,000 / year typical (taught master’s band — confirm xjtlu.edu.cn program page)", fees: "Application has no fee for international undergraduates. Master’s confirm the program." },
      admissionsUrl: "https://www.xjtlu.edu.cn/en/admissions/global/how-to-apply", admissionsLabel: "XJTLU how to apply",
      programsUrl: "https://www.xjtlu.edu.cn/en/study/undergraduate" },
    { id: "unnc-ningbo", name: "University of Nottingham Ningbo China", country: "China", city: "Ningbo", capital: false, type: "Private",
      programs: ["BSc Finance, Accounting and Management", "BSc International Business Management", "BSc Computer Science with Artificial Intelligence", "BA International Communications Studies", "BSc Financial Technology", "MSc Finance and Investment", "MSc International Management", "MSc Financial Technology"],
      bachelor: { tuition: "RMB 120,000 / year (international undergraduate — confirm nottingham.edu.cn)", fees: "English throughout. University of Nottingham award. Mainland/HMT rates are lower." },
      master: { tuition: "RMB 120,000 / year typical (confirm the postgraduate taught fee on nottingham.edu.cn)", fees: "Apply on the UNNC Application Hub. Campus accommodation about RMB 11,000–20,000 / year." },
      admissionsUrl: "https://www.nottingham.edu.cn/en/study-with-us/undergraduate/how-to-apply.aspx", admissionsLabel: "UNNC undergraduate apply",
      programsUrl: "https://www.nottingham.edu.cn/en/study-with-us/courses-and-programmes.aspx" },
    { id: "zju-hangzhou", name: "Zhejiang University", country: "China", city: "Hangzhou", capital: false, type: "Public",
      programs: ["MA China Studies", "MA Chinese Economy", "iMBA", "MSc Data Science (iMDS)", "MSc Mechanical Engineering", "MSc Energy and Power Engineering", "MA Linguistics and Applied Linguistics", "MBA Global Manufacturing and Supply Chain"],
      bachelor: null,
      master: { tuition: "RMB 36,800 / year typical (2026 English master’s catalogue; Linguistics RMB 30,800; iMBA/professional programs are dearer — confirm iczu.zju.edu.cn)", tuitionEU: "RMB 36,800 / year typical", fees: "English master’s; Chinese bachelor’s are not listed here. Application RMB 800. Some ZIBS programs sit on the Haining International Campus." },
      admissionsUrl: "https://intlstudent.zju.edu.cn/", admissionsLabel: "ZJU international apply",
      programsUrl: "https://iczu.zju.edu.cn/admissionsen/wasterwswwegreewwrograms/list.htm" },
    { id: "fudan-shanghai", name: "Fudan University", country: "China", city: "Shanghai", capital: false, type: "Public",
      programs: ["MA Chinese Politics and Diplomacy", "MA International Public Policy", "MA Global Public Policy", "IMPA Public Administration", "MA Chinese Language and Culture", "MA Chinese Society and Public Policy", "MA BRICS Countries and the Global South", "MSc Electronic Information"],
      bachelor: null,
      master: { tuition: "RMB 50,000 / year typical (2026 English postgraduate floor; MGPP RMB 100,000 / year, IMPA RMB 120,000 / year — confirm iso.fudan.edu.cn)", tuitionEU: "RMB 50,000 / year typical", fees: "English master’s; Chinese bachelor’s are not listed here. Application RMB 800." },
      admissionsUrl: "https://istudent.fudan.edu.cn/apply", admissionsLabel: "Fudan apply",
      programsUrl: "https://iso.fudan.edu.cn/isoenglish/wnglishwtaughtwwrograms/list.htm" },
    { id: "tsinghua-beijing", name: "Tsinghua University", country: "China", city: "Beijing", capital: true, type: "Public",
      programs: ["MSc Advanced Computing", "Global MBA", "LLM Chinese Law", "Master of Global Affairs (Schwarzman)", "MPA International Development (MID)", "International Master of Public Administration", "MSc Environmental Science, Engineering and Management", "MA Chinese Politics, Foreign Policy and International Relations"],
      bachelor: null,
      master: { tuition: "RMB 39,000 / year typical (2026 Advanced Computing); Global MBA RMB 198,000 full program; LLM Chinese Law RMB 146,000 full program — confirm yz.tsinghua.edu.cn", tuitionEU: "RMB 39,000 / year typical", fees: "English master’s; Chinese bachelor’s are not listed here. Schwarzman is a separate funded application at schwarzmanscholars.org." },
      admissionsUrl: "https://yz.tsinghua.edu.cn/en/Admissions/How_to_Apply.htm", admissionsLabel: "Tsinghua graduate apply",
      programsUrl: "https://yz.tsinghua.edu.cn/en/info/1013/1036.htm" },
    { id: "pku-beijing", name: "Peking University", country: "China", city: "Beijing", capital: true, type: "Public",
      programs: ["MA China Studies (Yenching Academy)", "LLM Chinese Law", "IMPA Public Administration", "MA International Relations", "Global Master in Management", "MA New Media", "MSc Computer Science", "MBA Guanghua"],
      bachelor: null,
      master: { tuition: "RMB 50,000 / year typical (2026 English Computer Science); LLM Chinese Law RMB 160,000; IMPA RMB 190,000 / year — confirm isd.pku.edu.cn. Yenching is fellowship-funded.", tuitionEU: "RMB 50,000 / year typical", fees: "English master’s; Chinese bachelor’s are not listed here. Yenching applies at yenchingacademy.pku.edu.cn." },
      admissionsUrl: "https://isd.pku.edu.cn/en/detail.php?id=729", admissionsLabel: "PKU international graduate",
      programsUrl: "https://isd.pku.edu.cn/en/detail.php?id=729" },
    { id: "cuhksz-shenzhen", name: "CUHK-Shenzhen", country: "China", city: "Shenzhen", capital: false, type: "Public",
      programs: ["BSc Computer Science and Engineering", "BSc Finance", "BSc Financial Engineering", "BBA Global Business Studies", "BSc Data Science and Big Data Technology", "BSc Economics", "BEng Electrical and Computer Engineering", "BSc Statistics"],
      bachelor: { tuition: "CNY 162,000 / year (published 2027 international undergraduate band — confirm intladmissions.cuhk.edu.cn for the current intake)", fees: "English is the primary medium. On-campus accommodation about CNY 2,400 / academic year on the published 2027 sheet." },
      master: null,
      admissionsUrl: "https://intladmissions.cuhk.edu.cn/en", admissionsLabel: "CUHK-Shenzhen international UG",
      programsUrl: "https://registry.cuhk.edu.cn/en/page/20" },
    { id: "wku-wenzhou", name: "Wenzhou-Kean University", country: "China", city: "Wenzhou", capital: false, type: "Private",
      programs: ["BSc Computer Science", "BBA Global Business", "BSc Finance", "BA Psychology", "BSc Accounting", "MBA Global Management", "MSc Accounting", "MA Psychology"],
      bachelor: { tuition: "RMB 68,000 / year (2026–27 international undergraduate)", fees: "English throughout (Kean University curriculum). Application RMB 400; deposit RMB 10,000 toward tuition." },
      master: { tuition: "RMB 110,000 typical (2026 M.S./M.A. band); Global MBA RMB 180,000 — confirm wku.edu.cn", fees: "Graduate apply at ga.wku.edu.cn." },
      admissionsUrl: "https://intlapply.wku.edu.cn/", admissionsLabel: "WKU international apply",
      programsUrl: "https://admission.wku.edu.cn/en/internationalstudents" },
    { id: "sjtu-shanghai", name: "Shanghai Jiao Tong University", country: "China", city: "Shanghai", capital: false, type: "Public",
      programs: ["BEng Mechanical Engineering (Global College)", "BEng Electrical and Computer Engineering (Global College)", "BSc Computer Science (English cluster)", "MSc Information and Communication Engineering", "MSc Computer Science and Technology", "MSc Mechanical Engineering", "MBA", "MA Journalism and Communication"],
      bachelor: { tuition: "CNY 120,000 / year (2026 English undergraduate engineering cluster / Global College)", fees: "English cluster and UM-SJTU Global College. Application about USD 75." },
      master: { tuition: "RMB 28,900 / year typical (2025/26 English master’s catalogue band; some joint programs are dearer — confirm apply.sjtu.edu.cn)", tuitionEU: "RMB 28,900 / year typical", fees: "Application RMB 800 for graduate programs." },
      admissionsUrl: "https://apply.sjtu.edu.cn", admissionsLabel: "SJTU apply",
      programsUrl: "https://en.sjtu.edu.cn/study-sjtu/prospective/degree-programs/270" },
  ];

  window.GLOBALED_SCHOOLS.push(...schools);

  const fgv = (window.GLOBALED_SCHOOLS || []).find((school) => school.id === "fgv-saopaulo");
  if (fgv) {
    fgv.programs = ["BBA Business Administration (English)", "Master in International Management (MPGI)", "CEMS Master in International Management", "MPGI (Yale Global Business and Society)", "MPGI (Columbia SIPA)", "MPGI (Bocconi International Management)", "MPGI (HEC Paris)", "MPGI (HKUST)"];
    fgv.bachelor = { tuition: "BRL 7,850 / month (2026.1 full-time English or Portuguese stream)", fees: "English stream: all required courses in English. International-exam (IB/SAT) applicants are placed on the English stream." };
    fgv.master = { tuition: "Confirm MPGI on eaesp.fgv.br / mestrado-doutorado.fgv.br (double-degree partner fees extra)", fees: "MPGI and CEMS are English. Academic Portuguese MBA/MPA tracks are not listed here." };
    fgv.admissionsUrl = "https://vestibular.fgv.br/en/courses/sao-paulo/business-administration";
    fgv.admissionsLabel = "FGV EAESP undergraduate apply";
    fgv.programsUrl = "https://eaesp.fgv.br/en/courses/undergraduate-program-business-administration";
    delete fgv.blurb;
  }

  const nyuSh = (window.GLOBALED_SCHOOLS || []).find((school) => school.id === "nyu-shanghai");
  if (nyuSh) nyuSh.programsUrl = nyuSh.programsUrl || "https://shanghai.nyu.edu/academics";
  const dku = (window.GLOBALED_SCHOOLS || []).find((school) => school.id === "duke-kunshan");
  if (dku) dku.programsUrl = dku.programsUrl || "https://dukekunshan.edu.cn/en/academics";

  Object.assign(window.GLOBALED_COUNTRIES, {
    Brazil: {
      safetyIndex: 34.0,
      region: "Latin America",
      blurb: "Solid listing of verified full English-taught degrees — not every Portuguese campus. FGV EAESP (São Paulo) and SKEMA (Belo Horizonte) offer English bachelor’s; FGV EBAPE and COPPEAD/UFRJ are English master’s in Rio. Public bachelor’s remain Portuguese.",
      photo: "https://images.unsplash.com/photo-1483729558449-99ef03a2d348?auto=format&fit=crop&w=1400&q=80",
    },
    China: {
      safetyIndex: 76.0,
      region: "Asia",
      blurb: "Solid listing of English-medium joint campuses and English master’s at the flagships — not a complete national directory. NYU Shanghai, DKU, XJTLU, UNNC, CUHK-Shenzhen, and Wenzhou-Kean teach bachelor’s in English; Tsinghua, Peking, Fudan, Zhejiang, and SJTU are listed mainly for English graduate degrees.",
      photo: "https://images.unsplash.com/photo-1548919973-5b8a7d454f2a?auto=format&fit=crop&w=1400&q=80",
    },
  });

  Object.assign(window.GLOBALED_CITIES, {
    "Belo Horizonte": { country: "Brazil", apartment1br: "BRL 2,200 / month", apartmentNote: "Below São Paulo and Rio.", safetyIndex: 32.0, photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80" },
    Beijing: { country: "China", apartment1br: "CNY 7,500 / month", apartmentNote: "City-centre 1-bed sample.", safetyIndex: 70.0, photo: "https://images.unsplash.com/photo-1508804185872-d7badb00b47d?auto=format&fit=crop&w=1400&q=80" },
    Suzhou: { country: "China", apartment1br: "CNY 4,500 / month", apartmentNote: "Below Shanghai; campus housing is common at XJTLU.", safetyIndex: 72.0, photo: "https://images.unsplash.com/photo-1548919973-5b8a7d454f2a?auto=format&fit=crop&w=1400&q=80" },
    Ningbo: { country: "China", apartment1br: "CNY 4,000 / month", apartmentNote: "Below Shanghai.", safetyIndex: 70.0, photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80" },
    Hangzhou: { country: "China", apartment1br: "CNY 5,500 / month", apartmentNote: "Below Shanghai; West Lake demand lifts some neighbourhoods.", safetyIndex: 72.0, photo: "https://images.unsplash.com/photo-1548919973-5b8a7d454f2a?auto=format&fit=crop&w=1400&q=80" },
    Shenzhen: { country: "China", apartment1br: "CNY 6,500 / month", apartmentNote: "Below central Shanghai; tech-city demand is tight.", safetyIndex: 68.0, photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80" },
    Wenzhou: { country: "China", apartment1br: "CNY 3,800 / month", apartmentNote: "Below Hangzhou and Shanghai.", safetyIndex: 68.0, photo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80" },
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
