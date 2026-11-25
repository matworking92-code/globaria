const els = {
  heroSearch: document.querySelector("#hero-search"),
  heroCountry: document.querySelector("#hero-country"),
  heroLevel: document.querySelector("#hero-level"),
  heroDelivery: document.querySelector("#hero-delivery"),
  destCards: document.querySelector("#destination-cards"),
  tuitionMin: document.querySelector("#tuition-min"),
  tuitionMax: document.querySelector("#tuition-max"),
  tuitionMinLabel: document.querySelector("#tuition-min-label"),
  tuitionMaxLabel: document.querySelector("#tuition-max-label"),
  tuitionBoundMin: document.querySelector("#tuition-bound-min"),
  tuitionBoundMax: document.querySelector("#tuition-bound-max"),
  tuitionFill: document.querySelector("#tuition-fill"),
  safetyMin: document.querySelector("#safety-min"),
  safetyMax: document.querySelector("#safety-max"),
  safetyMinLabel: document.querySelector("#safety-min-label"),
  safetyMaxLabel: document.querySelector("#safety-max-label"),
  safetyFill: document.querySelector("#safety-fill"),
  dailyMin: document.querySelector("#daily-min"),
  dailyMax: document.querySelector("#daily-max"),
  dailyMinLabel: document.querySelector("#daily-min-label"),
  dailyMaxLabel: document.querySelector("#daily-max-label"),
  dailyFill: document.querySelector("#daily-fill"),
  rentMin: document.querySelector("#rent-min"),
  rentMax: document.querySelector("#rent-max"),
  rentMinLabel: document.querySelector("#rent-min-label"),
  rentMaxLabel: document.querySelector("#rent-max-label"),
  rentBoundMin: document.querySelector("#rent-bound-min"),
  rentBoundMax: document.querySelector("#rent-bound-max"),
  rentFill: document.querySelector("#rent-fill"),
  subjectChips: document.querySelector("#subject-chips"),
  subjectFilters: document.querySelector("#subject-filters"),
  shortlistTray: document.querySelector("#shortlist-tray"),
  search: document.querySelector("#globaled-query"),
  countryFilters: document.querySelector("#country-filters"),
  cityFilters: document.querySelector("#city-filters"),
  sort: document.querySelector("#sort-filter"),
  destSort: document.querySelector("#dest-sort"),
  destSortSide: document.querySelector("#dest-sort-side"),
  clear: document.querySelector("#clear-filters"),
  title: document.querySelector("#results-title"),
  count: document.querySelector("#results-count"),
  list: document.querySelector("#results-list"),
};

const REGION_ORDER = ["Europe", "North America", "Asia", "Middle East", "Latin America", "Africa", "Oceania"];

const SUBJECTS = [
  { id: "", label: "All subjects" },
  { id: "business", label: "Business" },
  { id: "computing", label: "Computing" },
  { id: "engineering", label: "Engineering" },
  { id: "life", label: "Life sciences" },
  { id: "social", label: "Social sciences" },
  { id: "health", label: "Health" },
];

const CODE_CURRENCIES = ["NOK", "CZK", "JPY", "KRW", "MYR", "THB", "TWD", "HKD", "AED", "QAR", "MXN", "CLP", "ARS", "COP", "BRL", "ZAR", "GHS", "KES", "INR", "PLN", "HUF", "SEK", "IDR", "PHP", "TRY", "EGP", "NZD", "AUD", "CAD", "GBP", "RUB", "BYN", "CNY", "VND", "ILS", "RON", "ISK", "PKR", "BDT", "LKR", "NPR", "BND", "MOP", "SAR", "KWD", "BHD", "OMR", "JOD", "NGN", "RWF", "UGX", "TZS", "ETB", "BWP", "NAD", "MUR", "MAD", "ZMW", "PEN", "UYU", "CRC", "JMD", "TTD", "FJD", "GEL", "AMD", "AZN", "UAH", "KHR", "UZS", "KGS"];
const MONEY_PREFIX = new RegExp(`(S?\\$|€|£|${CODE_CURRENCIES.join("|")})\\s*([\\d,]+(?:\\.\\d+)?)`, "i");
const MONEY_RANGE = new RegExp(`(S?\\$|€|£|${CODE_CURRENCIES.join("|")})\\s*([\\d,]+(?:\\.\\d+)?)(?:\\s*[–-]\\s*(?:S?\\$|€|£|${CODE_CURRENCIES.join("|")})?\\s*([\\d,]+(?:\\.\\d+)?))?`, "gi");

const SHORTLIST_KEY = "globaled-shortlist";
const SHORTLIST_MAX = 3;
const PROGRAMME_CAP = 8;

const DEGREE_TITLES = [
  ["EMBA", "Executive Master of Business Administration"],
  ["MLitt", "Master of Letters"],
  ["MPharm", "Master of Pharmacy"],
  ["MPhil", "Master of Philosophy"],
  ["MArch", "Master of Architecture"],
  ["MSBA", "Master of Science in Business Analytics"],
  ["BEng", "Bachelor of Engineering"],
  ["BDes", "Bachelor of Design"],
  ["BArch", "Bachelor of Architecture"],
  ["MMus", "Master of Music"],
  ["BMus", "Bachelor of Music"],
  ["BBA", "Bachelor of Business Administration"],
  ["LLB", "Bachelor of Laws"],
  ["LLM", "Master of Laws"],
  ["MBA", "Master of Business Administration"],
  ["MSc", "Master of Science"],
  ["MEng", "Master of Engineering"],
  ["MPA", "Master of Public Administration"],
  ["MPH", "Master of Public Health"],
  ["MEd", "Master of Education"],
  ["MEM", "Master of Engineering Management"],
  ["MSN", "Master of Science in Nursing"],
  ["DVM", "Doctor of Veterinary Medicine"],
  ["BSc", "Bachelor of Science"],
  ["BEd", "Bachelor of Education"],
  ["MD", "Doctor of Medicine"],
  ["BA", "Bachelor of Arts"],
  ["MA", "Master of Arts"],
];

const filters = {
  query: "",
  countries: [],
  city: "",
  level: "",
  delivery: "",
  sort: "price",
  destSort: "region",
  openId: "",
  subject: "",
  duration: "",
  residency: "non-eu",
  tuitionMin: 0,
  tuitionMax: 0,
  safetyMin: 0,
  safetyMax: 100,
  dailyMin: 0,
  dailyMax: 0,
  rentMin: 0,
  rentMax: 0,
};

const rangeBounds = {
  tuition: { min: 0, max: 0, step: 50 },
  safety: { min: 0, max: 100, step: 1 },
  daily: { min: 0, max: 0, step: 1 },
  rent: { min: 0, max: 0, step: 25 },
};

const schoolById = new Map();
const catalogue = [];
let shortlist = [];
let shortlistOpen = false;
let schoolCountCache = null;
let schoolCountKey = "";
const RESULTS_ONLY_KEYS = new Set(["query", "sort", "openId"]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelCount(count, singular, plural) {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

function spellDegreeCodes(text) {
  let out = String(text || "");
  for (const [code, title] of DEGREE_TITLES) {
    out = out.replace(new RegExp(`\\b${code}\\b`, "gi"), title);
  }
  return out;
}

function formatProgramName(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  for (const [code, title] of DEGREE_TITLES) {
    const match = text.match(new RegExp(`^${code}(?:\\s*\\((Hons|Honours)\\))?(?:\\s+(.*))?$`, "i"));
    if (!match) continue;
    const honours = match[1] ? " (Honours)" : "";
    const full = `${title}${honours}`;
    const rest = spellDegreeCodes(String(match[2] || "").trim());
    if (!rest) return full;
    return `${rest}, ${full}`;
  }
  return spellDegreeCodes(text);
}

function programLevel(name) {
  const text = String(name || "");
  const lower = text.toLowerCase();
  if (/\b(\d)[ -]?year undergraduate\b/.test(lower)) return "Bachelor’s";
  if (
    /^(ma|msc|mba|llm|meng|mph|mphil|mlitt|mpa|med|march|mem|msn|msba|emba|mmus|md|master)\b/i.test(text) ||
    /\b(master|mba|msc|llm|mmus|mlitt)\b/.test(lower)
  ) {
    return "Master’s";
  }
  return "Bachelor’s";
}

const SCOTTISH_CITIES = new Set(["Edinburgh", "Glasgow", "St Andrews", "Aberdeen", "Dundee", "Stirling"]);

const BACHELOR_YEARS = {
  Norway: 3, Netherlands: 3, Germany: 3, France: 3, Italy: 3, Spain: 3, Portugal: 3,
  Belgium: 3, Austria: 3, Poland: 3, "Czech Republic": 3, Hungary: 3, Finland: 3,
  Sweden: 3, Greece: 3, Romania: 3, Turkey: 3, Russia: 3, Belarus: 3, Israel: 3,
  Cyprus: 4, Ireland: 4, "United Kingdom": 3, Canada: 4, Australia: 3, "New Zealand": 3,
  Japan: 4, "South Korea": 4, Taiwan: 4, China: 4, "Hong Kong": 4, Singapore: 4,
  Malaysia: 3, Thailand: 4, Indonesia: 4, Philippines: 4, India: 3, Vietnam: 4,
  Kazakhstan: 4, "United Arab Emirates": 4, Qatar: 4, Mexico: 4, Chile: 4,
  Argentina: 4, Colombia: 4, Brazil: 4, "South Africa": 3, Ghana: 4, Kenya: 4, Egypt: 4,
  Estonia: 3, Latvia: 3, Lithuania: 3, Slovakia: 3, Slovenia: 3, Croatia: 3, Serbia: 3,
  Bulgaria: 4, Malta: 3, Iceland: 3, Luxembourg: 3, Ukraine: 4, Georgia: 4, Armenia: 4,
  Azerbaijan: 4, "North Macedonia": 3, Pakistan: 4, Bangladesh: 4, "Sri Lanka": 3,
  Nepal: 4, Cambodia: 4, Brunei: 4, Macau: 4, Uzbekistan: 3, Kyrgyzstan: 4,
  "Saudi Arabia": 4, Kuwait: 4, Bahrain: 4, Oman: 4, Jordan: 4, Lebanon: 4,
  Nigeria: 4, Rwanda: 4, Uganda: 3, Tanzania: 3, Ethiopia: 4, Botswana: 4, Namibia: 4,
  Mauritius: 3, Morocco: 4, Zimbabwe: 4, Zambia: 4, Peru: 4, Uruguay: 4, Ecuador: 4,
  "Costa Rica": 4, Panama: 4, Jamaica: 3, "Trinidad and Tobago": 3, Fiji: 3,
};

const MASTER_YEARS = {
  "United Kingdom": 1, Ireland: 1, Australia: 1, "New Zealand": 1, Netherlands: 1,
};

function programYears(name, school) {
  const text = String(name || "");
  const lower = text.toLowerCase();
  const named = text.match(/(\d)\s*[-–]?\s*year/i);
  if (named) return Number(named[1]);
  if (/\b(md|mbbs|mbchb)\b/i.test(text) && !/\b(msc|master)\b/i.test(text)) return 6;
  if (/^(md\s+)?medicine\b/i.test(text.trim()) || /\b(bachelor of medicine|doctor of medicine)\b/i.test(text)) return 6;
  if (/\bdentistry\b|\bdds\b|\bdmd\b/.test(lower)) return 5;
  if (/\bmpharm\b/i.test(text) || /\bpharmacy\b/.test(lower)) return 5;
  if (/\bdvm\b/i.test(text) || /\bveterinary\b/.test(lower)) return 5;
  if (/\barchitecture\b/.test(lower) && /\b(integrated|march)\b/.test(lower)) return 5;
  if (/\b(mba|emba)\b/i.test(text)) return 1;
  const level = programLevel(name);
  if (level === "Master’s") {
    if (/\bmeng\b/i.test(text) && school.country === "United Kingdom") return 4;
    return MASTER_YEARS[school.country] || 2;
  }
  if (school.country === "United Kingdom" && SCOTTISH_CITIES.has(school.city)) return 4;
  if (school.country === "United Kingdom" && /\bmeng\b/i.test(text)) return 4;
  return BACHELOR_YEARS[school.country] || 3;
}

function durationLabel(years, short) {
  if (!years) return "Confirm length";
  if (years === 1) return short ? "1 year" : "1 year typical";
  return short ? `${years} years` : `${years} years typical`;
}

function durationRangeLabel(programs) {
  const years = [...new Set(programs.map((item) => item.years).filter((n) => n > 0))].sort((a, b) => a - b);
  if (!years.length) return "Confirm length";
  if (years.length === 1) return durationLabel(years[0]);
  return `${years[0]}–${years[years.length - 1]} years typical`;
}

function durationBand(years) {
  if (!years) return "";
  if (years <= 2) return "1-2";
  if (years === 3) return "3";
  if (years === 4) return "4";
  return "5";
}

function programDelivery(school, name) {
  if (school.programDelivery?.[name]) return school.programDelivery[name];
  if (school.defaultDelivery) return school.defaultDelivery;
  if (/\bonline\b|\bdistance\b|\bremote\b/i.test(name)) return "Remote";
  if (/\bhybrid\b|\bblended\b/i.test(name)) return "Hybrid";
  return "On campus";
}

function programSubject(name) {
  const t = String(name || "").toLowerCase();
  if (/\b(mba|business|management|finance|account|marketing|econom|tourism|hotel|hospitality|supply chain|agribusiness|bcom|commerce)\b/.test(t)) return "business";
  if (/\b(computer|computing|informatic|software|data science|artificial intelligence|cyber|information technology|\bit\b|digital economy)\b/.test(t)) return "computing";
  if (/\b(engineer|mechanical|civil|electrical|aerospace|mechatronic|nuclear|architecture|materials)\b/.test(t)) return "engineering";
  if (/\b(medic|nurs|health|pharm|public health|biomedical|dental|pharmacy)\b/.test(t)) return "health";
  if (/\b(biolog|agricultur|environment|forestry|ecology|chemistry|physics|mathematics|life science|natural resource|plant|limnolog|organic|horticult)\b/.test(t)) return "life";
  if (/\b(politic|international relation|law|history|philosoph|sociolog|psycholog|media|journalis|public admin|development|peace|english|humanit|diplomacy|society|communication|llb|llm)\b/.test(t)) return "social";
  return "";
}

function subjectLabel(id) {
  return SUBJECTS.find((item) => item.id === id)?.label || "";
}

function moneyCurrency(raw) {
  const token = String(raw || "").toUpperCase();
  if (CODE_CURRENCIES.includes(token)) return token;
  return raw;
}

function moneyFromText(text) {
  const match = String(text || "").match(MONEY_PREFIX);
  if (!match) return null;
  const amount = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return null;
  return { currency: moneyCurrency(match[1]), amount };
}

function formatMoney(currency, amount) {
  const n = Math.round(amount).toLocaleString("en-US");
  if (CODE_CURRENCIES.includes(currency)) return `${currency} ${n}`;
  return `${currency}${n}`;
}

function usdLabel(amount) {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

function roughUsd(amount) {
  if (!Number.isFinite(amount)) return null;
  if (amount < 50) return Math.round(amount);
  return Math.round(amount / 10) * 10;
}

function usdRentLine(text) {
  const str = String(text || "");
  const re = new RegExp(MONEY_RANGE.source, "gi");
  const parts = [...str.matchAll(re)];
  if (!parts.length) return str;
  const amounts = [];
  let converted = false;
  for (const part of parts) {
    const cur = moneyCurrency(part[1]);
    if (cur !== "$") converted = true;
    const nums = [part[2], part[3]].filter(Boolean).map((n) => toUsd(cur, Number(String(n).replace(/,/g, ""))));
    amounts.push(...nums.filter((n) => Number.isFinite(n) && n > 0));
  }
  if (!amounts.length) return str;
  const rounded = amounts.map(roughUsd);
  const body = rounded.length === 1
    ? usdLabel(rounded[0])
    : `${usdLabel(rounded[0])}–${usdLabel(rounded[rounded.length - 1])}`;
  return `${converted ? "~" : ""}${body} / month`;
}

function usdRentLineFromUsd(usd) {
  const n = roughUsd(usd);
  if (n == null) return "";
  return `~${usdLabel(n)}`;
}

function withUsd(localLabel, currency, amount) {
  if (!localLabel) return "";
  if (!currency || currency === "$" || !Number.isFinite(amount)) return localLabel;
  return `${localLabel} (${usdLabel(toUsd(currency, amount))})`;
}

function moneyTextWithUsd(text) {
  const str = String(text || "");
  const re = new RegExp(MONEY_RANGE.source, "gi");
  const parts = [...str.matchAll(re)];
  if (!parts.length) return str;
  const converted = parts.flatMap((part) => {
    const cur = moneyCurrency(part[1]);
    if (cur === "$") return [];
    const amounts = [part[2], part[3]].filter(Boolean).map((n) => usdLabel(toUsd(cur, Number(n.replace(/,/g, "")))));
    return amounts;
  });
  if (!converted.length) return str;
  if (converted.length === 1) return `${str} (${converted[0]})`;
  return `${str} (${converted[0]}–${converted[converted.length - 1]})`;
}

function feeBlock(school, level) {
  const block = level === "Bachelor’s" ? school.bachelor : school.master;
  if (!block) return null;
  if (filters.residency !== "eu") return block;
  if (block.tuitionEU) return { ...block, tuition: block.tuitionEU };
  if (school.type === "Public" && school.country === "Austria") {
    return { ...block, tuition: "€0 / semester" };
  }
  if (school.type === "Public" && school.country === "Norway") {
    return { ...block, tuition: "NOK 0 / semester" };
  }
  return block;
}

function semesterTuition(block) {
  if (!block) return { label: "Fees not confirmed", usd: Number.NaN, currency: "" };
  const parsed = moneyFromText(block.tuition);
  if (!parsed) return { label: "Fees not confirmed", usd: Number.NaN, currency: "" };
  const semester = /semester/i.test(block.tuition) ? parsed.amount : parsed.amount / 2;
  const local = `${formatMoney(parsed.currency, semester)} / semester`;
  return {
    label: withUsd(local, parsed.currency, semester),
    usd: toUsd(parsed.currency, semester),
    currency: parsed.currency,
  };
}

function toUsd(currency, amount) {
  const rates = {
    "€": 1.1,
    "S$": 0.74,
    NOK: 0.095,
    CZK: 0.045,
    JPY: 0.0068,
    KRW: 0.00072,
    MYR: 0.23,
    THB: 0.031,
    TWD: 0.031,
    HKD: 0.128,
    AED: 0.272,
    QAR: 0.275,
    MXN: 0.055,
    CLP: 0.00105,
    ARS: 0.0008,
    COP: 0.00025,
    BRL: 0.185,
    ZAR: 0.056,
    GHS: 0.08,
    KES: 0.0077,
    INR: 0.012,
    PLN: 0.25,
    HUF: 0.0027,
    SEK: 0.095,
    IDR: 0.000061,
    PHP: 0.0175,
    TRY: 0.029,
    EGP: 0.021,
    NZD: 0.58,
    AUD: 0.65,
    CAD: 0.73,
    "£": 1.27,
    GBP: 1.27,
    RUB: 0.011,
    BYN: 0.30,
    CNY: 0.14,
    VND: 0.000038,
    ILS: 0.28,
    RON: 0.23,
    ISK: 0.0073,
    PKR: 0.0036,
    BDT: 0.0082,
    LKR: 0.0033,
    NPR: 0.0075,
    BND: 0.74,
    MOP: 0.124,
    SAR: 0.267,
    KWD: 3.25,
    BHD: 2.65,
    OMR: 2.60,
    JOD: 1.41,
    NGN: 0.00065,
    RWF: 0.00070,
    UGX: 0.00027,
    TZS: 0.00039,
    ETB: 0.0070,
    BWP: 0.073,
    NAD: 0.056,
    MUR: 0.022,
    MAD: 0.10,
    ZMW: 0.038,
    PEN: 0.27,
    UYU: 0.025,
    CRC: 0.0020,
    JMD: 0.0063,
    TTD: 0.15,
    FJD: 0.44,
    GEL: 0.37,
    AMD: 0.0026,
    AZN: 0.59,
    UAH: 0.024,
    KHR: 0.00025,
    UZS: 0.000078,
    KGS: 0.011,
  };
  return amount * (rates[currency] ?? 1);
}

function citySafety(countryName, cityName) {
  return Catalogue.safety(countryName, cityName);
}

function dailyVsUsOf(countryName, cityName) {
  const col = Catalogue.colNyc(countryName, cityName);
  const us = Catalogue.usColNyc || 68.8;
  if (!Number.isFinite(col) || col <= 0 || !us) return null;
  return (col / us) * 100;
}

function rentUsdOf(countryName, cityName) {
  return rentUsdFromText(Catalogue.city(countryName, cityName)?.apartment1br);
}

function dailyVsUsLabel(pct) {
  return `${Math.round(pct)}% of US`;
}

function snapBound(minRaw, maxRaw, step) {
  return {
    min: Math.floor(minRaw / step) * step,
    max: Math.ceil(maxRaw / step) * step,
    step,
  };
}

function computeRangeBounds() {
  const tuitions = catalogue.map((item) => item.usd).filter((n) => Number.isFinite(n));
  const safeties = Catalogue.schools
    .map((school) => Catalogue.safety(school.country, school.city))
    .filter((n) => Number.isFinite(n) && n > 0);
  const dailies = Catalogue.schools
    .map((school) => dailyVsUsOf(school.country, school.city))
    .filter((n) => Number.isFinite(n) && n > 0);
  const rents = Catalogue.schools
    .map((school) => rentUsdOf(school.country, school.city))
    .filter((n) => Number.isFinite(n) && n > 0);
  const tMinRaw = tuitions.length ? Math.floor(Math.min(...tuitions)) : 0;
  const tMaxRaw = tuitions.length ? Math.ceil(Math.max(...tuitions)) : 0;
  const tStep = tMaxRaw - tMinRaw > 4000 ? 50 : tMaxRaw - tMinRaw > 1000 ? 25 : 1;
  rangeBounds.tuition = snapBound(tMinRaw, tMaxRaw, tStep);
  rangeBounds.safety = {
    min: safeties.length ? Math.floor(Math.min(...safeties)) : 0,
    max: safeties.length ? Math.ceil(Math.max(...safeties)) : 100,
    step: 1,
  };
  const dMinRaw = dailies.length ? Math.floor(Math.min(...dailies)) : 0;
  const dMaxRaw = dailies.length ? Math.ceil(Math.max(...dailies)) : 0;
  rangeBounds.daily = snapBound(dMinRaw, dMaxRaw, 1);
  const rMinRaw = rents.length ? Math.floor(Math.min(...rents)) : 0;
  const rMaxRaw = rents.length ? Math.ceil(Math.max(...rents)) : 0;
  const rStep = rMaxRaw - rMinRaw > 2000 ? 50 : rMaxRaw - rMinRaw > 800 ? 25 : 10;
  rangeBounds.rent = snapBound(rMinRaw, rMaxRaw, rStep);
}

function resetRanges() {
  filters.tuitionMin = rangeBounds.tuition.min;
  filters.tuitionMax = rangeBounds.tuition.max;
  filters.safetyMin = rangeBounds.safety.min;
  filters.safetyMax = rangeBounds.safety.max;
  filters.dailyMin = rangeBounds.daily.min;
  filters.dailyMax = rangeBounds.daily.max;
  filters.rentMin = rangeBounds.rent.min;
  filters.rentMax = rangeBounds.rent.max;
}

function tuitionRangeActive() {
  return filters.tuitionMin > rangeBounds.tuition.min || filters.tuitionMax < rangeBounds.tuition.max;
}

function programPassesRanges(item) {
  if (tuitionRangeActive()) {
    if (!Number.isFinite(item.usd) || item.usd < filters.tuitionMin || item.usd > filters.tuitionMax) return false;
  }
  if (safetyRangeActive()) {
    const score = citySafety(item.country, item.city);
    if (score < filters.safetyMin || score > filters.safetyMax) return false;
  }
  if (dailyRangeActive()) {
    const daily = dailyVsUsOf(item.country, item.city);
    if (!Number.isFinite(daily) || daily < filters.dailyMin || daily > filters.dailyMax) return false;
  }
  if (rentRangeActive()) {
    const rent = rentUsdOf(item.country, item.city);
    if (!Number.isFinite(rent) || rent < filters.rentMin || rent > filters.rentMax) return false;
  }
  return true;
}

function safetyRangeActive() {
  return filters.safetyMin > rangeBounds.safety.min || filters.safetyMax < rangeBounds.safety.max;
}

function dailyRangeActive() {
  return filters.dailyMin > rangeBounds.daily.min || filters.dailyMax < rangeBounds.daily.max;
}

function rentRangeActive() {
  return filters.rentMin > rangeBounds.rent.min || filters.rentMax < rangeBounds.rent.max;
}

function setDualFill(fill, min, max, boundMin, boundMax) {
  if (!fill) return;
  const span = boundMax - boundMin || 1;
  const left = ((min - boundMin) / span) * 100;
  const right = ((max - boundMin) / span) * 100;
  fill.style.left = `${left}%`;
  fill.style.width = `${Math.max(0, right - left)}%`;
}

function syncRangeControls(forceValues) {
  const t = rangeBounds.tuition;
  const s = rangeBounds.safety;
  const d = rangeBounds.daily;
  const r = rangeBounds.rent;
  const busy = [
    els.tuitionMin, els.tuitionMax, els.safetyMin, els.safetyMax,
    els.dailyMin, els.dailyMax, els.rentMin, els.rentMax,
  ].includes(document.activeElement);
  const writeValues = forceValues || !busy;
  for (const [input, bound, value] of [
    [els.tuitionMin, t, filters.tuitionMin],
    [els.tuitionMax, t, filters.tuitionMax],
    [els.safetyMin, s, filters.safetyMin],
    [els.safetyMax, s, filters.safetyMax],
    [els.dailyMin, d, filters.dailyMin],
    [els.dailyMax, d, filters.dailyMax],
    [els.rentMin, r, filters.rentMin],
    [els.rentMax, r, filters.rentMax],
  ]) {
    if (!input) continue;
    input.min = bound.min;
    input.max = bound.max;
    input.step = bound.step;
    if (writeValues) input.value = value;
  }
  if (els.tuitionMinLabel) els.tuitionMinLabel.textContent = usdLabel(filters.tuitionMin);
  if (els.tuitionMaxLabel) els.tuitionMaxLabel.textContent = usdLabel(filters.tuitionMax);
  if (els.tuitionBoundMin) els.tuitionBoundMin.textContent = usdLabel(t.min);
  if (els.tuitionBoundMax) els.tuitionBoundMax.textContent = usdLabel(t.max);
  if (els.safetyMinLabel) els.safetyMinLabel.textContent = `${filters.safetyMin} / 100`;
  if (els.safetyMaxLabel) els.safetyMaxLabel.textContent = `${filters.safetyMax} / 100`;
  if (els.dailyMinLabel) els.dailyMinLabel.textContent = dailyVsUsLabel(filters.dailyMin);
  if (els.dailyMaxLabel) els.dailyMaxLabel.textContent = dailyVsUsLabel(filters.dailyMax);
  if (els.rentMinLabel) els.rentMinLabel.textContent = usdLabel(filters.rentMin);
  if (els.rentMaxLabel) els.rentMaxLabel.textContent = usdLabel(filters.rentMax);
  if (els.rentBoundMin) els.rentBoundMin.textContent = usdLabel(r.min);
  if (els.rentBoundMax) els.rentBoundMax.textContent = usdLabel(r.max);
  setDualFill(els.tuitionFill, filters.tuitionMin, filters.tuitionMax, t.min, t.max);
  setDualFill(els.safetyFill, filters.safetyMin, filters.safetyMax, s.min, s.max);
  setDualFill(els.dailyFill, filters.dailyMin, filters.dailyMax, d.min, d.max);
  setDualFill(els.rentFill, filters.rentMin, filters.rentMax, r.min, r.max);
  els.tuitionMin?.classList.toggle("is-top", filters.tuitionMin > (t.min + t.max) / 2);
  els.safetyMin?.classList.toggle("is-top", filters.safetyMin > (s.min + s.max) / 2);
  els.dailyMin?.classList.toggle("is-top", filters.dailyMin > (d.min + d.max) / 2);
  els.rentMin?.classList.toggle("is-top", filters.rentMin > (r.min + r.max) / 2);
  document.querySelector(".range-filter--tuition")?.classList.toggle("is-narrowed", tuitionRangeActive());
  document.querySelector(".range-filter--safety")?.classList.toggle("is-narrowed", safetyRangeActive());
  document.querySelector(".range-filter--daily")?.classList.toggle("is-narrowed", dailyRangeActive());
  document.querySelector(".range-filter--rent")?.classList.toggle("is-narrowed", rentRangeActive());
  paintRangeChips();
}

function readRangePair(minInput, maxInput, bound, which) {
  let min = Number(minInput.value);
  let max = Number(maxInput.value);
  if (which === "min" && min > max) min = max;
  if (which === "max" && max < min) max = min;
  min = Math.min(bound.max, Math.max(bound.min, min));
  max = Math.min(bound.max, Math.max(bound.min, max));
  minInput.value = min;
  maxInput.value = max;
  return { min, max };
}

function paintRangeChips() {
  const el = document.querySelector("#range-chips");
  if (!el) return;
  const chips = [];
  if (tuitionRangeActive()) chips.push(["tuition", `Tuition ${usdLabel(filters.tuitionMin)}–${usdLabel(filters.tuitionMax)}`]);
  if (safetyRangeActive()) chips.push(["safety", `Safety ${filters.safetyMin}–${filters.safetyMax}`]);
  if (dailyRangeActive()) chips.push(["daily", `Daily ${dailyVsUsLabel(filters.dailyMin)}–${dailyVsUsLabel(filters.dailyMax)}`]);
  if (rentRangeActive()) chips.push(["rent", `1-bed ${usdLabel(filters.rentMin)}–${usdLabel(filters.rentMax)}`]);
  if (!chips.length) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  el.hidden = false;
  el.innerHTML = `${chips.map(([id, label]) =>
    `<button type="button" class="range-chip range-chip--${id}" data-reset-range="${id}">${escapeHtml(label)} ×</button>`
  ).join("")}<button type="button" class="range-chip-reset" data-reset-range="all">Reset sliders</button>`;
}

function resetOneRange(kind) {
  if (kind === "all") {
    resetRanges();
    return;
  }
  const bound = rangeBounds[kind];
  if (!bound) return;
  filters[`${kind}Min`] = bound.min;
  filters[`${kind}Max`] = bound.max;
}

function cityOf(school) {
  return Catalogue.city(school.country, school.city) || {};
}

function countryOf(school) {
  return Catalogue.country(school.country) || {};
}

function housingOf(school) {
  const own = school.housing;
  if (own?.dormsAvailable === false) return own;
  if (own?.dormsIncluded) return own;
  const city = cityOf(school);
  const ownMonthly = (own?.dormMonthly || "").trim();
  const cityMonthly = (city.dormMonthly || "").trim();
  if (ownMonthly && cityMonthly && ownMonthly !== cityMonthly) return own;
  if (cityMonthly) {
    return { dormsIncluded: false, dormsAvailable: true, dormMonthly: cityMonthly };
  }
  if (own) return own;
  const halls = countryOf(school).halls;
  return halls ? { dormsIncluded: false, dormsAvailable: true, dormMonthly: halls } : {};
}

function schoolBlurb(school) {
  if (school.blurbCustom && school.blurb) return school.blurb;
  const city = school.city;
  const hasBachelor = Boolean(school.bachelor);
  const hasMaster = Boolean(school.master);
  let offer;
  if (hasBachelor && hasMaster) offer = `English-taught bachelor’s and master’s in ${city}.`;
  else if (hasMaster) offer = `English-taught master’s in ${city}; bachelor’s is typically not in English here.`;
  else if (hasBachelor) offer = `English-taught bachelor’s in ${city}.`;
  else offer = `English-taught degrees in ${city}.`;
  const remote = school.defaultDelivery === "Remote" ? " Distance or online study." : "";
  return `${offer}${remote} Internationals apply on the school site.`;
}

function listedPrograms(school) {
  const names = school.programs || [];
  if (names.length <= PROGRAMME_CAP) return names;
  const bachelor = [];
  const master = [];
  for (const name of names) {
    (programLevel(name) === "Master’s" ? master : bachelor).push(name);
  }
  if (!bachelor.length) return master.slice(0, PROGRAMME_CAP);
  if (!master.length) return bachelor.slice(0, PROGRAMME_CAP);
  let takeBachelor = Math.min(bachelor.length, Math.ceil(PROGRAMME_CAP / 2));
  const takeMaster = Math.min(master.length, PROGRAMME_CAP - takeBachelor);
  takeBachelor = Math.min(bachelor.length, PROGRAMME_CAP - takeMaster);
  return [...bachelor.slice(0, takeBachelor), ...master.slice(0, takeMaster)];
}

function programsListUrl(school) {
  return school.programsUrl || school.admissionsUrl;
}

function photoOf(school) {
  return school.photo || cityOf(school).photo || countryOf(school).photo || "";
}

function safetyBand(index) {
  const score = Number(index);
  if (!Number.isFinite(score)) return null;
  if (score >= 80) return { score, word: "Very safe", cls: "is-very-safe" };
  if (score >= 60) return { score, word: "Safe", cls: "is-safe" };
  if (score >= 40) return { score, word: "Moderate", cls: "is-moderate" };
  if (score >= 20) return { score, word: "Caution", cls: "is-caution" };
  return { score, word: "Concern", cls: "is-concern" };
}

function safetyFigHtml(index, withOutOf) {
  const band = safetyBand(index);
  if (!band) return "";
  const num = withOutOf ? `${band.score.toFixed(0)} / 100` : band.score.toFixed(0);
  const edition = Catalogue.source?.edition || "Numbeo Safety Index";
  return `<span class="safety-fig ${band.cls}" title="${edition}. Higher is safer." aria-label="Safety index ${num} ${band.word}">${num} <span class="safety-word">${escapeHtml(band.word)}</span></span>`;
}

function rentUsdFromText(text) {
  const parsed = moneyFromText(text);
  if (!parsed) return null;
  const usd = toUsd(parsed.currency, parsed.amount);
  return Number.isFinite(usd) && usd > 0 ? usd : null;
}

function vsUsWords(level, hint) {
  const rows = {
    1: { word: "Much cheaper than the US", short: "Much cheaper" },
    2: { word: "Cheaper than the US", short: "Cheaper" },
    3: { word: "About the same as the US", short: "Same as US" },
    4: { word: "More expensive than the US", short: "More expensive" },
    5: { word: "Much more expensive than the US", short: "Much more expensive" },
  };
  return { level, hint, ...rows[level] };
}

function dailyBandFromNyc(colNyc) {
  if (!Number.isFinite(colNyc) || colNyc <= 0) return null;
  const us = Catalogue.usColNyc || 68.8;
  const vsUs = (colNyc / us) * 100;
  const hint = `Numbeo cost of living excluding rent is ${colNyc.toFixed(1)} vs New York = 100 (United States ${us}). Groceries, restaurants, transport, and utilities — not rent.`;
  if (vsUs < 70) return vsUsWords(1, hint);
  if (vsUs < 90) return vsUsWords(2, hint);
  if (vsUs < 110) return vsUsWords(3, hint);
  if (vsUs < 130) return vsUsWords(4, hint);
  return vsUsWords(5, hint);
}

function colNycOfCity(countryName, cityName) {
  return Catalogue.colNyc(countryName, cityName);
}

function colNycOfCountry(countryName) {
  return Catalogue.colNyc(countryName);
}

function costBand(value) {
  return dailyBandFromNyc(value);
}

function costBandOfCity(country, city) {
  return dailyBandFromNyc(colNycOfCity(country, city));
}

function costBandOfCountry(countryName) {
  return dailyBandFromNyc(colNycOfCountry(countryName));
}

function costGlyphs(level) {
  return [1, 2, 3, 4, 5]
    .map((n) => `<i${n > level ? ' class="is-off"' : ""}>$</i>`)
    .join("");
}

function costMarkHtml(band) {
  if (!band) return "";
  const title = `${band.hint} Dollar marks ($–$$$$$) compare daily costs with the United States, not rent.`;
  return `
    <div class="cost-mark" title="${escapeHtml(title)}" aria-label="Daily costs ${"$".repeat(band.level)} ${band.word}, ${band.level} of 5">
      <span class="cost-mark-label">Daily costs vs US</span>
      <span class="cost-mark-glyphs" aria-hidden="true">${costGlyphs(band.level)}</span>
      <span class="cost-mark-word">${escapeHtml(band.word)}</span>
    </div>
  `;
}

function costInlineText(band) {
  if (!band) return "";
  return `${"$".repeat(band.level)} ${band.short || band.word}`;
}

const DEST_SORT_OPTIONS = [
  { id: "region", label: "By region" },
  { id: "alpha", label: "Alphabetical" },
  { id: "tuition", label: "Lowest tuition first" },
  { id: "housing", label: "Lowest housing first" },
  { id: "living", label: "Lowest daily costs first" },
  { id: "safety", label: "Safest first" },
];

function destSortHeading() {
  return DEST_SORT_OPTIONS.find((item) => item.id === filters.destSort)?.label || "By region";
}

function compareOptional(a, b, descending) {
  const aOk = Number.isFinite(a);
  const bOk = Number.isFinite(b);
  if (!aOk && !bOk) return 0;
  if (!aOk) return 1;
  if (!bOk) return -1;
  return descending ? b - a : a - b;
}

function matchesDuration(item) {
  if (!filters.duration) return true;
  return durationBand(item.years) === filters.duration;
}

function scopedCatalogue() {
  return catalogue.filter((item) => {
    if (filters.level && item.level !== filters.level) return false;
    if (filters.delivery && item.delivery !== filters.delivery) return false;
    if (filters.subject && item.subject !== filters.subject) return false;
    if (!matchesDuration(item)) return false;
    return true;
  });
}

function cheapestProgram(programs) {
  if (!programs?.length) return null;
  const priced = programs.filter((item) => Number.isFinite(item.usd));
  const pool = priced.length ? priced : programs;
  return pool.reduce((min, item) => (item.usd < min.usd ? item : min));
}

function rankingChips(school) {
  const tags = Array.isArray(school.rankings) ? school.rankings.filter((tag) => tag === "QS" || tag === "THE" || tag === "ARWU") : [];
  if (!tags.length) return "";
  return tags.map((tag) => `<span class="chip chip--rank" title="This institution appears in the ${tag === "THE" ? "Times Higher Education" : tag === "ARWU" ? "Shanghai (ARWU)" : "QS"} global university table. Not a GlobalEd rank or position.">${tag}</span>`).join("");
}

function cheapestUsdForSchool(schoolId) {
  const values = scopedCatalogue()
    .filter((item) => item.schoolId === schoolId && Number.isFinite(item.usd))
    .map((item) => item.usd);
  return values.length ? Math.min(...values) : null;
}

function medianUsd(values) {
  const nums = values.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!nums.length) return null;
  return nums[Math.floor((nums.length - 1) / 2)];
}

function schoolsInCountry(countryName) {
  return Catalogue.schoolsInCountry(countryName);
}

function cityRowForFilter(cityName) {
  const countries = selectedCountries();
  if (countries.length === 1) return Catalogue.city(countries[0], cityName);
  const pool = countries.length ? countries : Catalogue.countryNames();
  for (const country of pool) {
    const row = Catalogue.city(country, cityName);
    if (row) return row;
  }
  return null;
}

function countryMetric(countryName, key) {
  const schools = schoolsInCountry(countryName);
  if (key === "tuition") return medianUsd(schools.map((school) => cheapestUsdForSchool(school.id)));
  if (key === "housing") {
    const cities = [...new Set(schools.map((school) => school.city))];
    return medianUsd(cities.map((city) => rentUsdFromText(Catalogue.city(countryName, city)?.apartment1br)));
  }
  if (key === "living") {
    const col = colNycOfCountry(countryName);
    return Number.isFinite(col) ? col : null;
  }
  if (key === "safety") {
    const score = Number(Catalogue.country(countryName)?.safetyIndex);
    return Number.isFinite(score) ? score : null;
  }
  return null;
}

function cityMetric(cityName, key) {
  const row = cityRowForFilter(cityName);
  const countries = selectedCountries();
  const schools = Catalogue.schools.filter((school) => {
    if (school.city !== cityName) return false;
    return !countries.length || countries.includes(school.country);
  });
  if (key === "tuition") return medianUsd(schools.map((school) => cheapestUsdForSchool(school.id)));
  if (key === "housing") return rentUsdFromText(row?.apartment1br);
  if (key === "living") {
    const col = row ? colNycOfCity(row.country, row.name) : null;
    return Number.isFinite(col) ? col : null;
  }
  if (key === "safety") {
    const score = Number(row?.safetyIndex);
    return Number.isFinite(score) ? score : null;
  }
  return null;
}

function sortByDestMetric(items, nameOf, metricOf) {
  const key = filters.destSort;
  if (key === "region") return items;
  return [...items].sort((a, b) => {
    if (key === "alpha") return String(nameOf(a)).localeCompare(String(nameOf(b)));
    const cmp = compareOptional(metricOf(nameOf(a), key), metricOf(nameOf(b), key), key === "safety");
    if (cmp) return cmp;
    return String(nameOf(a)).localeCompare(String(nameOf(b)));
  });
}

function countryEntries() {
  return Catalogue.countryList().filter(([name]) => Catalogue.schoolsInCountry(name).length);
}

function destMetricHint(name, kind) {
  const key = filters.destSort;
  if (key === "region") return "";
  const metric = kind === "city" ? cityMetric : countryMetric;
  const value = metric(name, key);
  if (key === "tuition") return Number.isFinite(value) ? `From ${usdLabel(value)} / semester` : "";
  if (key === "housing") return Number.isFinite(value) ? `1-bed ${usdLabel(value)} / month` : "";
  if (key === "living") return costInlineText(costBand(value)) || "";
  if (key === "safety") {
    const band = safetyBand(value);
    return band ? `Safety ${band.score.toFixed(0)} / 100 · ${band.word}` : "";
  }
  return "";
}

function buildData() {
  schoolById.clear();
  catalogue.length = 0;
  schoolCountCache = null;
  schoolCountKey = "";
  for (const school of Catalogue.schools) {
    schoolById.set(school.id, school);
    listedPrograms(school).forEach((name, index) => {
      const level = programLevel(name);
      const block = feeBlock(school, level);
      const tuition = semesterTuition(block);
      const delivery = programDelivery(school, name);
      const subject = programSubject(name);
      const years = programYears(name, school);
      catalogue.push({
        id: `${school.id}-${index}`,
        name,
        level,
        delivery,
        subject,
        years,
        schoolId: school.id,
        schoolName: school.name,
        city: school.city,
        country: school.country,
        applyUrl: programsListUrl(school),
        semesterLabel: tuition.label,
        usd: tuition.usd,
        haystack: [name, formatProgramName(name), school.name, school.city, school.country, level, delivery, subjectLabel(subject), durationLabel(years, true)]
          .join(" ")
          .toLowerCase(),
      });
    });
  }
}

function selectedCountries() {
  return filters.countries;
}

function tallyScope() {
  return filters.countries.length ? filters.countries : Catalogue.countryNames();
}

function matchingPrograms() {
  const query = filters.query.trim().toLowerCase();
  const countries = selectedCountries();
  if (!countries.length) return [];
  return catalogue.filter((item) => {
    if (!countries.includes(item.country)) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.level && item.level !== filters.level) return false;
    if (filters.delivery && item.delivery !== filters.delivery) return false;
    if (filters.subject && item.subject !== filters.subject) return false;
    if (!matchesDuration(item)) return false;
    if (query && !(item.haystack || "").includes(query)) return false;
    if (!programPassesRanges(item)) return false;
    return true;
  });
}

function matchingSchools(programs) {
  const match = programs || matchingPrograms();
  const ids = [...new Set(match.map((item) => item.schoolId))];
  const schools = ids.map((id) => schoolById.get(id)).filter(Boolean);
  let cheapestBySchool = null;
  if (filters.sort === "price") {
    cheapestBySchool = new Map();
    for (const item of match) {
      if (!Number.isFinite(item.usd)) continue;
      const prev = cheapestBySchool.get(item.schoolId);
      if (prev == null || item.usd < prev) cheapestBySchool.set(item.schoolId, item.usd);
    }
  }
  return schools.sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "safety") {
      return compareOptional(cityOf(a).safetyIndex, cityOf(b).safetyIndex, true) || a.name.localeCompare(b.name);
    }
    if (filters.sort === "housing" || filters.sort === "living") {
      const rent = (school) => rentUsdFromText(cityOf(school).apartment1br);
      if (filters.sort === "living") {
        const level = (school) => costBandOfCity(school.country, school.city)?.level || 99;
        return level(a) - level(b) || compareOptional(rent(a), rent(b), false) || a.name.localeCompare(b.name);
      }
      return compareOptional(rent(a), rent(b), false) || a.name.localeCompare(b.name);
    }
    const priceOf = (school) => cheapestBySchool.get(school.id) ?? Number.POSITIVE_INFINITY;
    return priceOf(a) - priceOf(b) || a.name.localeCompare(b.name);
  });
}

function ensureSchoolCounts() {
  const key = [
    filters.level, filters.delivery, filters.subject, filters.duration,
    filters.tuitionMin, filters.tuitionMax, filters.safetyMin, filters.safetyMax,
    filters.dailyMin, filters.dailyMax, filters.rentMin, filters.rentMax,
  ].join("\0");
  if (schoolCountCache && schoolCountKey === key) return schoolCountCache;
  const byCountry = new Map();
  const byCityCountry = new Map();
  for (const item of catalogue) {
    if (filters.level && item.level !== filters.level) continue;
    if (filters.delivery && item.delivery !== filters.delivery) continue;
    if (filters.subject && item.subject !== filters.subject) continue;
    if (!matchesDuration(item)) continue;
    if (!programPassesRanges(item)) continue;
    let countrySet = byCountry.get(item.country);
    if (!countrySet) {
      countrySet = new Set();
      byCountry.set(item.country, countrySet);
    }
    countrySet.add(item.schoolId);
    const cityKey = `${item.country}\0${item.city}`;
    let citySet = byCityCountry.get(cityKey);
    if (!citySet) {
      citySet = new Set();
      byCityCountry.set(cityKey, citySet);
    }
    citySet.add(item.schoolId);
  }
  schoolCountCache = { byCountry, byCityCountry };
  schoolCountKey = key;
  return schoolCountCache;
}

function tallyFor(country, city) {
  const counts = ensureSchoolCounts();
  if (city) {
    const countries = country ? [country] : tallyScope();
    if (countries.length === 1) return counts.byCityCountry.get(`${countries[0]}\0${city}`)?.size || 0;
    const seen = new Set();
    for (const name of countries) {
      const set = counts.byCityCountry.get(`${name}\0${city}`);
      if (!set) continue;
      for (const id of set) seen.add(id);
    }
    return seen.size;
  }
  if (country) return counts.byCountry.get(country)?.size || 0;
  let total = 0;
  for (const name of tallyScope()) total += counts.byCountry.get(name)?.size || 0;
  return total;
}

function groupedCountries() {
  const groups = {};
  for (const [name, meta] of Catalogue.countryList()) {
    if (!Catalogue.schoolsInCountry(name).length) continue;
    const region = meta.region || "Other";
    (groups[region] ||= []).push([name, meta]);
  }
  return groups;
}

function sizedPhoto(url, width) {
  const raw = String(url || "");
  if (!raw || !raw.includes("images.unsplash.com")) return raw;
  if (/[?&]w=\d+/.test(raw)) return raw.replace(/([?&])w=\d+/, `$1w=${width}`);
  return `${raw}${raw.includes("?") ? "&" : "?"}w=${width}`;
}

function destImgHtml(url, eager) {
  if (!url) return "";
  const unsplash = String(url).includes("images.unsplash.com");
  const src = sizedPhoto(url, 400);
  const src2x = sizedPhoto(url, 800);
  const srcset = unsplash
    ? ` srcset="${escapeHtml(src)} 400w, ${escapeHtml(src2x)} 800w" sizes="(max-width: 960px) 92vw, (max-width: 1100px) 45vw, 220px"`
    : "";
  const load = eager ? `fetchpriority="high"` : `loading="lazy"`;
  return `<img src="${escapeHtml(src)}"${srcset} alt="" width="400" height="220" ${load} decoding="async" onerror="this.remove()">`;
}

function destCardHtml(name, meta, eager) {
  const on = filters.countries.length === 1 && filters.countries[0] === name;
  const daily = costInlineText(costBandOfCountry(name));
  const rentUsd = countryMetric(name, "housing");
  const extra = destMetricHint(name, "country");
  const n = tallyFor(name);
  const bits = [
    safetyFigHtml(meta.safetyIndex),
    daily ? `<span>${escapeHtml(daily)} daily</span>` : "",
    rentUsd ? `<span>1-bed ${escapeHtml(usdRentLineFromUsd(rentUsd))}</span>` : "",
    extra && extra !== daily && !extra.startsWith("Safety ") && extra !== (rentUsd ? `1-bed ${usdRentLineFromUsd(rentUsd)}` : "") ? `<span>${escapeHtml(extra)}</span>` : "",
    `<span>${escapeHtml(labelCount(n, "university", "universities"))}</span>`,
  ].filter(Boolean);
  const photo = meta.photo || "";
  const cta = n ? "View universities" : "No matches — widen sliders";
  return `
    <button class="dest-card${on ? " is-on" : ""}${n ? "" : " is-dim"}" type="button" data-country="${escapeHtml(name)}">
      ${destImgHtml(photo, eager)}
      <div>
        <strong>${escapeHtml(name)}</strong>
        <span class="dest-meta">${bits.join("")}</span>
        <span class="dest-cta">${escapeHtml(cta)}</span>
      </div>
    </button>`;
}

function destCardsMarkup(entries, eagerFirst) {
  return entries.map(([name, meta], i) => destCardHtml(name, meta, eagerFirst && i < 8)).join("");
}

function paintDestinations() {
  const groups = groupedCountries();
  const options = [`<option value="">Choose a destination</option>`];
  for (const region of REGION_ORDER) {
    const entries = groups[region];
    if (!entries?.length) continue;
    options.push(`<optgroup label="${escapeHtml(region)}">${entries
      .map(([name]) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
      .join("")}</optgroup>`);
  }
  els.heroCountry.innerHTML = options.join("");
  if (filters.destSort === "region") {
    let firstRegion = true;
    els.destCards.innerHTML = REGION_ORDER.map((region) => {
      const entries = groups[region];
      if (!entries?.length) return "";
      const eager = firstRegion;
      firstRegion = false;
      return `<div class="dest-region"><h3>${escapeHtml(region)}</h3><div class="dest-row">${destCardsMarkup(entries, eager)}</div></div>`;
    }).join("");
    return;
  }
  const ranked = sortByDestMetric(countryEntries(), (entry) => entry[0], countryMetric);
  els.destCards.innerHTML = `<div class="dest-region"><h3>${escapeHtml(destSortHeading())}</h3><div class="dest-row">${destCardsMarkup(ranked, true)}</div></div>`;
}

function countryFilterLabel(name) {
  const checked = filters.countries.includes(name);
  const hint = destMetricHint(name, "country");
  const extra = hint && filters.destSort !== "living" && filters.destSort !== "safety" ? ` · ${hint}` : "";
  return `<label><input type="checkbox" data-country="${escapeHtml(name)}" ${checked ? "checked" : ""}> ${escapeHtml(name)} (${tallyFor(name)})${escapeHtml(extra)}</label>`;
}

function paintCountryFilters() {
  if (filters.destSort === "region") {
    const groups = groupedCountries();
    els.countryFilters.innerHTML = REGION_ORDER.map((region) => {
      const entries = groups[region];
      if (!entries?.length) return "";
      return `<p class="filter-hint">${escapeHtml(region)}</p>${entries.map(([name]) => countryFilterLabel(name)).join("")}`;
    }).join("");
    return;
  }
  const ranked = sortByDestMetric(countryEntries(), (entry) => entry[0], countryMetric);
  els.countryFilters.innerHTML = `<p class="filter-hint">${escapeHtml(destSortHeading())}</p>${ranked
    .map(([name]) => countryFilterLabel(name))
    .join("")}`;
}

function paintSubjectFilters() {
  const buttons = SUBJECTS.map((item) => {
    const on = filters.subject === item.id;
    return `<button class="subject-chip${on ? " is-on" : ""}" type="button" data-subject="${escapeHtml(item.id)}">${escapeHtml(item.label)}</button>`;
  }).join("");
  if (els.subjectChips) els.subjectChips.innerHTML = buttons;
  if (els.subjectFilters) els.subjectFilters.innerHTML = buttons;
}

function paintCityFilters() {
  const countries = selectedCountries();
  const cityBox = els.cityFilters?.closest("fieldset");
  if (cityBox) cityBox.hidden = !countries.length;
  if (!countries.length) {
    els.cityFilters.innerHTML = "";
    return;
  }
  let cities = [...new Set(
    Catalogue.schools
      .filter((school) => countries.includes(school.country))
      .map((school) => school.city),
  )];
  if (filters.destSort === "region") cities.sort();
  else cities = sortByDestMetric(cities, (name) => name, cityMetric);
  if (filters.city && !cities.includes(filters.city)) filters.city = "";
  els.cityFilters.innerHTML = `<label><input type="radio" name="city" value="" ${filters.city ? "" : "checked"}> All cities</label>${cities
    .map((name) => {
      const n = tallyFor("", name);
      const hint = destMetricHint(name, "city");
      const extra = hint && filters.destSort !== "living" && filters.destSort !== "safety" ? ` · ${hint}` : "";
      return `<label><input type="radio" name="city" value="${escapeHtml(name)}" ${filters.city === name ? "checked" : ""}> ${escapeHtml(name)} (${n})${escapeHtml(extra)}</label>`;
    })
    .join("")}`;
}

function safetyRow(school) {
  const cityScore = Number(cityOf(school).safetyIndex) || 0;
  const cityBand = safetyBand(cityScore);
  return `
    <div class="safety" title="Numbeo Safety Index for this city, 2026. Higher is safer.">
      <span class="safety-label">Safety</span>
      <span class="safety-scores">
        <span><span class="safety-bar ${cityBand?.cls || ""}"><i style="width:${Math.min(100, cityScore)}%"></i></span> ${safetyFigHtml(cityScore, true)}</span>
      </span>
    </div>
  `;
}

function schoolCard(school, programs) {
  const housing = housingOf(school);
  const city = cityOf(school);
  const bachelor = programs.filter((item) => item.level === "Bachelor’s");
  const master = programs.filter((item) => item.level === "Master’s");
  const cheapest = cheapestProgram(programs);
  const modes = [...new Set(programs.map((item) => item.delivery))];
  const dorm = housing.dormsIncluded
    ? "Included"
    : housing.dormsAvailable && housing.dormMonthly
      ? housing.dormMonthly
      : "No campus halls";
  const saved = shortlist.includes(school.id);
  const saveLabel = saved ? "Saved" : shortlist.length >= SHORTLIST_MAX ? "Shortlist full" : "Save this stay";
  const open = filters.openId === school.id;
  const feeLabel = filters.residency === "eu" ? "From (EU/EEA)" : "From (non-EU)";
  const photo = photoOf(school);
  return `
    <article class="uni-card">
      <div class="uni-photo">${photo ? `<img src="${escapeHtml(photo)}" alt="" width="280" height="200" loading="lazy" decoding="async">` : ""}</div>
      <div class="uni-body">
        <h3>${escapeHtml(school.name)}</h3>
        ${school.listing === "index" || rankingChips(school) ? `<div class="chips chips--meta">${school.listing === "index" ? `<span class="chip chip--index">Index listing · fees not confirmed</span>` : ""}${rankingChips(school)}</div>` : ""}
        <dl class="uni-place">
          <div><dt>City</dt><dd>${escapeHtml(school.city)}</dd></div>
          <div><dt>Country</dt><dd>${escapeHtml(school.country)}</dd></div>
        </dl>
        <div class="pulse-row">
          ${safetyRow(school)}
          ${costMarkHtml(costBandOfCity(school.country, school.city))}
        </div>
        <div class="fact-row">
          <div class="fact fact--fee"><b>${feeLabel}</b><strong>${escapeHtml(cheapest?.semesterLabel || "Confirm")}</strong></div>
          <div class="fact fact--halls"><b>Typical halls</b><strong>${escapeHtml(moneyTextWithUsd(dorm))}</strong></div>
          <div class="fact fact--rent"><b>1-bed apartment</b><strong>${escapeHtml(usdRentLine(city.apartment1br || "Confirm locally"))}</strong></div>
          <div class="fact fact--length"><b>Program duration</b><strong>${escapeHtml(durationRangeLabel(programs))}</strong></div>
        </div>
        <div class="chips">
          ${bachelor.length ? `<span class="chip">${labelCount(bachelor.length, "bachelor’s", "bachelor’s")}</span>` : ""}
          ${master.length ? `<span class="chip">${labelCount(master.length, "master’s", "master’s")}</span>` : ""}
          ${modes.map((mode) => `<span class="chip mode-${mode === "Remote" ? "remote" : mode === "Hybrid" ? "hybrid" : "campus"}">${escapeHtml(mode)}</span>`).join("")}
        </div>
        <div class="uni-actions">
          <button class="book-btn" type="button" data-open="${escapeHtml(school.id)}">${open ? "Hide programs" : "View programs"}</button>
          <button class="ghost-btn save-btn${saved ? " is-on" : ""}" type="button" data-save="${escapeHtml(school.id)}" ${!saved && shortlist.length >= SHORTLIST_MAX ? "disabled" : ""}>${saveLabel}</button>
          <a class="ghost-btn" href="${escapeHtml(school.admissionsUrl)}" target="_blank" rel="noreferrer">Admissions site</a>
        </div>
      </div>
      ${open ? programPanel(school, bachelor, master) : ""}
    </article>
  `;
}

function programPanel(school, bachelor, master) {
  const row = (item) => `
    <li>
      <span>${escapeHtml(formatProgramName(item.name))}</span>
      <span class="chip duration">${escapeHtml(durationLabel(item.years, true))}</span>
      <span class="chip mode-${item.delivery === "Remote" ? "remote" : item.delivery === "Hybrid" ? "hybrid" : "campus"}">${escapeHtml(item.delivery)}</span>
      <a href="${escapeHtml(item.applyUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.semesterLabel)}</a>
    </li>
  `;
  const listUrl = programsListUrl(school);
  const sampled = (school.programs || []).length > PROGRAMME_CAP;
  return `
    <div class="programs">
      ${bachelor.length ? `<h4>Bachelor’s programs in English</h4><ul>${bachelor.map(row).join("")}</ul>` : ""}
      ${master.length ? `<h4>Master’s programs in English</h4><ul>${master.map(row).join("")}</ul>` : ""}
      <p class="programs-note">${sampled ? `Sample of English-taught programs — up to ${PROGRAMME_CAP}, copied from the school’s list.` : "English-taught programs from the school’s list."} <a href="${escapeHtml(listUrl)}" target="_blank" rel="noreferrer">Full list on the school site</a></p>
    </div>
  `;
}

function paintResults() {
  const programs = matchingPrograms();
  const schools = matchingSchools(programs);
  if (!filters.countries.length) {
    els.title.textContent = "Choose a destination";
    els.count.textContent = `${labelCount(countryEntries().length, "country", "countries")} — tap a photo card or tick a country on the left.`;
    els.list.innerHTML = "";
    document.querySelector(".board")?.classList.add("is-browse");
    return;
  }
  document.querySelector(".board")?.classList.remove("is-browse");
  const place = filters.city || (filters.countries.length === 1 ? filters.countries[0] : filters.countries.join(", "));
  els.title.textContent = filters.city || filters.countries.length === 1 ? `Study in ${place}` : "Available programs";
  const coverage = filters.countries.length === 1
    ? Catalogue.country(filters.countries[0])?.blurb
    : "";
  els.count.textContent = `${labelCount(programs.length, "English-taught program", "English-taught programs")} at ${labelCount(schools.length, "university", "universities")}${coverage ? ` · ${coverage}` : ""}`;
  if (!schools.length) {
    els.list.innerHTML = `<p class="empty">No English-taught programs match those filters. Try another subject, length, fee rate, destination, or widen tuition, safety, daily costs, and rent.</p>`;
    return;
  }
  els.list.innerHTML = schools
    .map((school) => schoolCard(school, programs.filter((item) => item.schoolId === school.id)))
    .join("");
}

function loadShortlist() {
  try {
    const raw = JSON.parse(localStorage.getItem(SHORTLIST_KEY) || "[]");
    shortlist = Array.isArray(raw) ? raw.filter((id) => schoolById.has(id)).slice(0, SHORTLIST_MAX) : [];
  } catch {
    shortlist = [];
  }
}

function persistShortlist() {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist));
}

function toggleShortlist(id) {
  if (!id || !schoolById.has(id)) return;
  if (shortlist.includes(id)) {
    shortlist = shortlist.filter((item) => item !== id);
  } else if (shortlist.length < SHORTLIST_MAX) {
    shortlist = [...shortlist, id];
  }
  persistShortlist();
  paintResults();
  paintShortlist();
}

function paintShortlist() {
  if (!els.shortlistTray) return;
  if (!shortlist.length) {
    shortlistOpen = false;
    els.shortlistTray.hidden = true;
    els.shortlistTray.classList.remove("is-open");
    els.shortlistTray.innerHTML = "";
    return;
  }
  const schools = shortlist.map((id) => schoolById.get(id)).filter(Boolean);
  const row = (label, value) => `<tr><th>${escapeHtml(label)}</th>${value}</tr>`;
  const cells = (fn) => schools.map((school) => `<td>${fn(school)}</td>`).join("");
  els.shortlistTray.hidden = false;
  els.shortlistTray.classList.toggle("is-open", shortlistOpen);
  els.shortlistTray.innerHTML = `
    <button class="shortlist-tab" type="button" data-toggle-shortlist aria-expanded="${shortlistOpen ? "true" : "false"}">
      <span>Saved stays <strong>${schools.length} / ${SHORTLIST_MAX}</strong></span>
      <span class="shortlist-tab-action">${shortlistOpen ? "Hide" : "Open"}</span>
    </button>
    <div class="shortlist-body">
      <div class="shortlist-compare">
        ${schools.map((school) => {
          const cheapest = cheapestProgram(catalogue.filter((item) => item.schoolId === school.id));
          return `<div class="shortlist-card">
            <strong>${escapeHtml(school.name)}</strong>
            <span>${escapeHtml(school.city)}, ${escapeHtml(school.country)}</span>
            <span>${escapeHtml(cheapest?.semesterLabel || "Confirm tuition")}</span>
            <button type="button" data-unsave="${escapeHtml(school.id)}">Remove</button>
          </div>`;
        }).join("")}
      </div>
      ${schools.length >= 2 ? `<table class="shortlist-table">
        ${row("Tuition from", cells((school) => {
          const cheapest = cheapestProgram(catalogue.filter((item) => item.schoolId === school.id));
          return escapeHtml(cheapest?.semesterLabel || "Confirm");
        }))}
        ${row("Halls", cells((school) => escapeHtml(moneyTextWithUsd(housingOf(school).dormMonthly || "No campus halls"))))}
        ${row("1-bed", cells((school) => escapeHtml(usdRentLine(cityOf(school).apartment1br || "Confirm"))))}
        ${row("Daily costs vs US", cells((school) => escapeHtml(costInlineText(costBandOfCity(school.country, school.city)) || "—")))}
        ${row("Program duration", cells((school) => escapeHtml(durationRangeLabel(catalogue.filter((item) => item.schoolId === school.id)))))}
        ${row("Safety index (city)", cells((school) => safetyFigHtml(cityOf(school).safetyIndex, true) || "—"))}
      </table>` : `<p class="filter-hint">Save a second university to compare tuition, halls, rent, length, and safety.</p>`}
    </div>
  `;
}

function applyResidency(next) {
  filters.residency = next;
  buildData();
  computeRangeBounds();
  resetRanges();
  paint();
}

function paint() {
  paintDestinations();
  paintCountryFilters();
  paintCityFilters();
  paintSubjectFilters();
  if (document.activeElement !== els.search) els.search.value = filters.query;
  els.sort.value = filters.sort;
  if (els.destSort) els.destSort.value = filters.destSort;
  if (els.destSortSide) els.destSortSide.value = filters.destSort;
  document.querySelectorAll('input[name="level"]').forEach((input) => {
    input.checked = input.value === filters.level;
  });
  document.querySelectorAll('input[name="delivery"]').forEach((input) => {
    input.checked = input.value === filters.delivery;
  });
  document.querySelectorAll('input[name="duration"]').forEach((input) => {
    input.checked = input.value === filters.duration;
  });
  document.querySelectorAll('input[name="residency-hero"], input[name="residency-side"]').forEach((input) => {
    input.checked = input.value === filters.residency;
  });
  els.heroCountry.value = filters.countries.length === 1 ? filters.countries[0] : "";
  els.heroLevel.value = filters.level;
  els.heroDelivery.value = filters.delivery;
  syncRangeControls(true);
  paintResults();
  paintShortlist();
}

function setFilters(next) {
  const wasEmpty = !filters.countries.length;
  const keys = Object.keys(next);
  const resultsOnly = keys.length > 0 && keys.every((key) => RESULTS_ONLY_KEYS.has(key));
  Object.assign(filters, next);
  const nowEmpty = !filters.countries.length;
  const browse = document.querySelector(".browse-destinations");
  if (browse && wasEmpty !== nowEmpty) browse.open = nowEmpty;
  if (resultsOnly) {
    paintResults();
    return;
  }
  paint();
}

function init() {
  buildData();
  computeRangeBounds();
  resetRanges();
  loadShortlist();
  filters.query = "";
  if (els.search) els.search.value = "";
  paint();

  els.heroSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    setFilters({
      countries: els.heroCountry.value ? [els.heroCountry.value] : [],
      level: els.heroLevel.value,
      delivery: els.heroDelivery.value,
      city: "",
      openId: "",
    });
    const target = els.heroCountry.value
      ? document.querySelector(".results-head")
      : document.querySelector(".browse-destinations");
    if (target) {
      if (!els.heroCountry.value) target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  els.destCards.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-country]");
    if (!btn) return;
    const name = btn.dataset.country;
    const already = filters.countries.length === 1 && filters.countries[0] === name;
    setFilters({ countries: already ? [] : [name], city: "", openId: "" });
    document.querySelector(".results-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  let searchTimer = 0;
  els.search.addEventListener("input", () => {
    const value = els.search.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => setFilters({ query: value, openId: "" }), 180);
  });
  els.sort.addEventListener("change", () => setFilters({ sort: els.sort.value }));
  const onDestSort = (event) => setFilters({ destSort: event.target.value });
  els.destSort?.addEventListener("change", onDestSort);
  els.destSort?.addEventListener("click", (event) => event.stopPropagation());
  els.destSort?.closest("label")?.addEventListener("click", (event) => event.stopPropagation());
  els.destSortSide?.addEventListener("change", onDestSort);
  els.clear.addEventListener("click", () => {
    resetRanges();
    setFilters({ query: "", countries: [], city: "", level: "", delivery: "", duration: "", sort: "price", destSort: "region", openId: "", subject: "" });
    if (filters.residency !== "non-eu") applyResidency("non-eu");
  });

  els.countryFilters.addEventListener("change", () => {
    const boxes = [...els.countryFilters.querySelectorAll("input[data-country]")];
    const selected = boxes.filter((box) => box.checked).map((box) => box.dataset.country);
    setFilters({
      countries: selected,
      city: "",
      openId: "",
    });
  });

  els.cityFilters.addEventListener("change", (event) => {
    if (event.target.name === "city") setFilters({ city: event.target.value, openId: "" });
  });

  document.querySelector(".filters").addEventListener("change", (event) => {
    if (event.target.name === "level") setFilters({ level: event.target.value, openId: "" });
    if (event.target.name === "delivery") setFilters({ delivery: event.target.value, openId: "" });
    if (event.target.name === "duration") setFilters({ duration: event.target.value, openId: "" });
    if (event.target.name === "residency-side") applyResidency(event.target.value);
  });

  const onSubject = (event) => {
    const btn = event.target.closest("[data-subject]");
    if (!btn) return;
    setFilters({ subject: btn.dataset.subject, openId: "" });
  };
  els.subjectChips?.addEventListener("click", onSubject);
  els.subjectFilters?.addEventListener("click", onSubject);

  document.querySelector(".hero-sliders")?.addEventListener("change", (event) => {
    if (event.target.name === "residency-hero") applyResidency(event.target.value);
  });
  document.querySelector(".hero-sliders")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-reset-range]");
    if (!btn) return;
    resetOneRange(btn.dataset.resetRange);
    schoolCountCache = null;
    syncRangeControls(true);
    paintDestinations();
    paintCountryFilters();
    paintCityFilters();
    paintResults();
  });

  const liveRange = (which, kind) => {
    const pair = readRangePair(els[`${kind}Min`], els[`${kind}Max`], rangeBounds[kind], which);
    filters[`${kind}Min`] = pair.min;
    filters[`${kind}Max`] = pair.max;
    schoolCountCache = null;
    syncRangeControls(false);
    paintResults();
    window.clearTimeout(liveRange.destTimer);
    liveRange.destTimer = window.setTimeout(() => {
      paintDestinations();
      els.heroCountry.value = filters.countries.length === 1 ? filters.countries[0] : "";
      paintCountryFilters();
      paintCityFilters();
    }, 90);
  };
  els.tuitionMin.addEventListener("input", () => liveRange("min", "tuition"));
  els.tuitionMax.addEventListener("input", () => liveRange("max", "tuition"));
  els.safetyMin.addEventListener("input", () => liveRange("min", "safety"));
  els.safetyMax.addEventListener("input", () => liveRange("max", "safety"));
  els.dailyMin?.addEventListener("input", () => liveRange("min", "daily"));
  els.dailyMax?.addEventListener("input", () => liveRange("max", "daily"));
  els.rentMin?.addEventListener("input", () => liveRange("min", "rent"));
  els.rentMax?.addEventListener("input", () => liveRange("max", "rent"));

  els.list.addEventListener("click", (event) => {
    const save = event.target.closest("[data-save]");
    if (save) {
      toggleShortlist(save.dataset.save);
      return;
    }
    const btn = event.target.closest("[data-open]");
    if (!btn) return;
    const id = btn.dataset.open;
    setFilters({ openId: filters.openId === id ? "" : id });
  });

  els.shortlistTray?.addEventListener("click", (event) => {
    const unsave = event.target.closest("[data-unsave]");
    if (unsave) {
      toggleShortlist(unsave.dataset.unsave);
      return;
    }
    if (event.target.closest("[data-toggle-shortlist]")) {
      shortlistOpen = !shortlistOpen;
      paintShortlist();
    }
  });
}

Catalogue.ready.then(() => init()).catch((err) => {
  console.error(err);
  if (els.title) els.title.textContent = "Catalogue failed to load";
  if (els.count) els.count.textContent = "Refresh the page, or rebuild with node english-programs-sample/scripts/build-catalogue.js";
});
