/**
 * Build compact GlobalEd data files from the legacy wave scripts (one-time / rebuild).
 * Output:
 *   data/indexes/numbeo-2026.json  — safety + cost-of-living, keyed by ISO + city slug
 *   data/places.json               — names, region, rent, halls, photos (no Numbeo scores)
 *   data/schools.json              — campus records that reference cc + city slug
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SAMPLE = path.join(__dirname, "..");
const DATA = path.join(SAMPLE, "data");
const INDEXES = path.join(DATA, "indexes");

const ISO = {
  Argentina: "AR", Australia: "AU", Austria: "AT", Belarus: "BY", Belgium: "BE",
  Brazil: "BR", Canada: "CA", Chile: "CL", China: "CN", Colombia: "CO",
  Cyprus: "CY", "Czech Republic": "CZ", Denmark: "DK", Egypt: "EG", Finland: "FI",
  France: "FR", Germany: "DE", Ghana: "GH", Greece: "GR", "Hong Kong": "HK",
  Hungary: "HU", India: "IN", Indonesia: "ID", Ireland: "IE", Israel: "IL",
  Italy: "IT", Japan: "JP", Kazakhstan: "KZ", Kenya: "KE", Malaysia: "MY",
  Mexico: "MX", Netherlands: "NL", "New Zealand": "NZ", Norway: "NO",
  Philippines: "PH", Poland: "PL", Portugal: "PT", Qatar: "QA", Romania: "RO",
  Russia: "RU", Singapore: "SG", "South Africa": "ZA", "South Korea": "KR",
  Spain: "ES", Sweden: "SE", Switzerland: "CH", Taiwan: "TW", Thailand: "TH",
  Turkey: "TR", "United Arab Emirates": "AE",   "United Kingdom": "GB",
  "United States": "US", Vietnam: "VN",
  Estonia: "EE", Latvia: "LV", Lithuania: "LT", Slovakia: "SK", Slovenia: "SI",
  Croatia: "HR", Serbia: "RS", Bulgaria: "BG", Malta: "MT", Iceland: "IS",
  Luxembourg: "LU", Ukraine: "UA", Georgia: "GE", Armenia: "AM", Azerbaijan: "AZ",
  "North Macedonia": "MK", Pakistan: "PK", Bangladesh: "BD", "Sri Lanka": "LK",
  Nepal: "NP", Cambodia: "KH", Brunei: "BN", Macau: "MO", Uzbekistan: "UZ",
  Kyrgyzstan: "KG", "Saudi Arabia": "SA", Kuwait: "KW", Bahrain: "BH", Oman: "OM",
  Jordan: "JO", Lebanon: "LB", Nigeria: "NG", Rwanda: "RW", Uganda: "UG",
  Tanzania: "TZ", Ethiopia: "ET", Botswana: "BW", Namibia: "NA", Mauritius: "MU",
  Morocco: "MA", Zimbabwe: "ZW", Zambia: "ZM", Peru: "PE", Uruguay: "UY",
  Ecuador: "EC", "Costa Rica": "CR", Panama: "PA", Jamaica: "JM",
  "Trinidad and Tobago": "TT", Fiji: "FJ",
};

const COUNTRY_HALLS = {
  "United Kingdom": "£150–£250 / week",
  Canada: "CAD 800–1,400 / month",
  Ireland: "€700–€1,100 / month",
  Netherlands: "€500–€900 / month",
  Belgium: "€250–€450 / month",
  Germany: "€250–€450 / month",
  Australia: "AUD 1,200–2,000 / month",
  Japan: "JPY 40,000–80,000 / month",
  "South Korea": "KRW 300,000–600,000 / month",
  France: "€250–€600 / month",
  Spain: "€350–€600 / month",
  Italy: "€300–€550 / month",
  Sweden: "SEK 4,600–7,500 / month",
  Poland: "PLN 800–1,500 / month",
  Finland: "€250–€450 / month",
  Portugal: "€250–€450 / month",
  Hungary: "HUF 50,000–90,000 / month",
  Denmark: "DKK 3,000–5,500 / month",
  Switzerland: "CHF 600–1,100 / month",
  Singapore: "S$800–1,400 / month",
  "Hong Kong": "HKD 1,700–4,250 / month",
  "New Zealand": "NZD 800–1,400 / month",
  Russia: "RUB 8,000–20,000 / month",
  Belarus: "$80–$150 / month",
  China: "CNY 2,000–5,000 / month",
  Brazil: "BRL 800–1,600 / month",
  Vietnam: "VND 4,000,000–8,000,000 / month",
  Greece: "€250–€450 / month",
  Israel: "ILS 2,000–4,000 / month",
  Romania: "RON 800–1,500 / month",
  Estonia: "€200–€400 / month", Latvia: "€150–€350 / month", Lithuania: "€150–€350 / month",
  Slovakia: "€150–€300 / month", Slovenia: "€150–€350 / month", Croatia: "€150–€300 / month",
  Serbia: "€100–€250 / month", Bulgaria: "€150–€280 / month", Malta: "€400–€700 / month",
  Iceland: "ISK 80,000–140,000 / month", Luxembourg: "€500–€900 / month",
  Ukraine: "$80–$180 / month", Georgia: "$80–$180 / month", Armenia: "$100–$200 / month",
  Azerbaijan: "$120–$250 / month", "North Macedonia": "€80–€180 / month",
  Pakistan: "PKR 20,000–40,000 / month", Bangladesh: "$60–$120 / month",
  "Sri Lanka": "$50–$120 / month", Nepal: "$50–$100 / month", Cambodia: "$120–$220 / month",
  Brunei: "BND 200–400 / month", Macau: "MOP 1,800–3,500 / month",
  Uzbekistan: "$80–$160 / month", Kyrgyzstan: "$70–$140 / month",
  "Saudi Arabia": "SAR 1,200–2,200 / month", Kuwait: "KWD 120–200 / month",
  Bahrain: "BHD 100–180 / month", Oman: "OMR 60–120 / month", Jordan: "JOD 80–160 / month",
  Lebanon: "$200–$400 / month", Nigeria: "$40–$90 / month", Rwanda: "$120–$220 / month",
  Uganda: "$50–$120 / month", Tanzania: "$40–$100 / month", Ethiopia: "$40–$90 / month",
  Botswana: "$80–$160 / month", Namibia: "$80–$160 / month",
  Mauritius: "MUR 4,000–8,000 / month", Morocco: "$200–$350 / month",
  Zimbabwe: "$50–$120 / month", Zambia: "$50–$110 / month",
  Peru: "PEN 800–1,400 / month", Uruguay: "UYU 8,000–14,000 / month",
  Ecuador: "$150–$280 / month", "Costa Rica": "Included in the residential program",
  Panama: "$300–$500 / month", Jamaica: "$150–$280 / month",
  "Trinidad and Tobago": "TTD 1,200–2,200 / month", Fiji: "FJD 400–700 / month",
};

const COUNTRY_COL_NYC = {
  Argentina: 41.3, Australia: 67.9, Austria: 71.3, Belarus: 30.5, Belgium: 68.6,
  Brazil: 30.1, Canada: 63.0, Chile: 39.0, China: 30.5, Colombia: 31.7,
  Cyprus: 58.8, "Czech Republic": 53.0, Denmark: 78.9, Egypt: 21.6, Finland: 69.0,
  France: 67.7, Germany: 68.7, Ghana: 33.9, Greece: 54.0, "Hong Kong": 75.2,
  Hungary: 46.9, India: 18.9, Indonesia: 26.1, Ireland: 70.6, Israel: 79.7,
  Italy: 61.4, Japan: 47.5, Kazakhstan: 29.8, Kenya: 28.9, Malaysia: 34.0,
  Mexico: 42.6, Netherlands: 73.4, "New Zealand": 60.3, Norway: 83.7,
  Philippines: 30.1, Poland: 47.3, Portugal: 48.8, Qatar: 50.4, Romania: 40.6,
  Russia: 36.5, Singapore: 87.7, "South Africa": 37.1, "South Korea": 61.6,
  Spain: 51.6, Sweden: 68.0, Switzerland: 110.7, Taiwan: 49.7, Thailand: 38.0,
  Turkey: 39.2, "United Arab Emirates": 55.2, "United Kingdom": 67.8,
  Vietnam: 26.4,
  Estonia: 52.4, Latvia: 47.8, Lithuania: 47.2, Slovakia: 47.1, Slovenia: 53.4,
  Croatia: 51.2, Serbia: 41.8, Bulgaria: 38.4, Malta: 56.1, Iceland: 83.2,
  Luxembourg: 76.4, Ukraine: 25.4, Georgia: 32.1, Armenia: 34.2, Azerbaijan: 30.4,
  "North Macedonia": 33.8, Pakistan: 18.2, Bangladesh: 22.1, "Sri Lanka": 25.6,
  Nepal: 24.1, Cambodia: 34.4, Brunei: 48.2, Macau: 64.8, Uzbekistan: 24.3,
  Kyrgyzstan: 22.4, "Saudi Arabia": 48.6, Kuwait: 50.2, Bahrain: 54.1, Oman: 47.3,
  Jordan: 44.2, Lebanon: 40.1, Nigeria: 21.8, Rwanda: 33.2, Uganda: 27.4,
  Tanzania: 26.2, Ethiopia: 28.1, Botswana: 40.1, Namibia: 38.2, Mauritius: 42.3,
  Morocco: 31.2, Zimbabwe: 32.4, Zambia: 28.3, Peru: 34.8, Uruguay: 54.2,
  Ecuador: 33.9, "Costa Rica": 43.4, Panama: 47.8, Jamaica: 46.2,
  "Trinidad and Tobago": 50.1, Fiji: 40.4,
};

const PHOTO = {
  Cyprus: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  Kazakhstan: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80",
  Norway: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1400&q=80",
  Austria: "https://images.unsplash.com/photo-1601581875309-fafbf2d74b11?auto=format&fit=crop&w=1400&q=80",
  "Czech Republic": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1400&q=80",
  Denmark: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1400&q=80",
  Switzerland: "https://images.unsplash.com/photo-1524350876685-277677218795?auto=format&fit=crop&w=1400&q=80",
};

const LEGACY = [
  "schools.js", "schools-extra.js", "schools-wave3.js", "schools-demand.js",
  "schools-wave4.js", "schools-wave5.js",   "schools-wave-giglobal.js", "schools-wave6.js", "schools-wave7.js",
  "schools-wave8.js", "schools-wave9.js", "schools-wave10.js", "schools-wave11.js",
];

function slug(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function modeText(values) {
  const counts = new Map();
  for (const value of values) {
    const key = String(value || "").trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = "";
  let bestCount = 0;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  return best;
}

function loadLegacy() {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  for (const file of LEGACY) {
    vm.runInContext(fs.readFileSync(path.join(SAMPLE, file), "utf8"), ctx, { filename: file });
  }
  return ctx.window;
}

function compact(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || value === "") continue;
    out[key] = value;
  }
  return out;
}

function main() {
  const win = loadLegacy();
  const schoolsIn = win.GLOBALED_SCHOOLS || [];
  const countriesIn = win.GLOBALED_COUNTRIES || {};
  const citiesIn = win.GLOBALED_CITIES || {};
  const housingIn = win.GLOBALED_HOUSING || {};
  const photosIn = win.GLOBALED_PHOTOS || {};

  const missingIso = Object.keys(countriesIn).filter((name) => !ISO[name]);
  if (missingIso.length) throw new Error("Missing ISO codes: " + missingIso.join(", "));

  const numbeo = {
    source: "Numbeo",
    edition: "2026 contributor survey",
    note: "Country and city scores live only here. Schools and places reference ISO + city slug; they do not copy these numbers. Refresh from Numbeo when the survey year changes — do not scrape at page-load.",
    urls: {
      safetyByCountry: "https://www.numbeo.com/safety/rankings_by_country.jsp",
      safetyByCity: "https://www.numbeo.com/safety/rankings.jsp",
      colByCountry: "https://www.numbeo.com/cost-of-living/rankings_by_country.jsp",
    },
    usColNyc: 68.8,
    countries: {},
    cities: {},
  };

  for (const [name, col] of Object.entries(COUNTRY_COL_NYC)) {
    const cc = ISO[name];
    if (!cc) continue;
    numbeo.countries[cc] = compact({
      safety: countriesIn[name] ? Number(countriesIn[name].safetyIndex) : undefined,
      colNyc: col,
    });
  }
  for (const [name, meta] of Object.entries(countriesIn)) {
    const cc = ISO[name];
    const row = numbeo.countries[cc] || (numbeo.countries[cc] = {});
    if (Number.isFinite(Number(meta.safetyIndex))) row.safety = Number(meta.safetyIndex);
  }

  const places = {};
  for (const [name, meta] of Object.entries(countriesIn)) {
    const cc = ISO[name];
    places[cc] = {
      name,
      region: meta.region,
      blurb: meta.blurb || "",
      photo: PHOTO[name] || meta.photo || "",
      halls: COUNTRY_HALLS[name] || "",
      cities: {},
    };
  }

  const usedCity = new Set(schoolsIn.map((school) => `${school.country}\0${school.city}`));
  for (const [cityName, meta] of Object.entries(citiesIn)) {
    const countryName = meta.country;
    const cc = ISO[countryName];
    if (!cc || !places[cc]) continue;
    if (!usedCity.has(`${countryName}\0${cityName}`)) continue;
    let id = slug(cityName);
    const taken = new Set(Object.keys(places[cc].cities));
    if (taken.has(id)) id = `${id}-${slug(countryName)}`;
    const citySchools = schoolsIn.filter((school) => school.country === countryName && school.city === cityName);
    const monthlies = citySchools.map((school) => {
      const own = housingIn[school.id];
      if (!own || own.dormsAvailable === false || own.dormsIncluded) return "";
      return own.dormMonthly || "";
    });
    const halls = meta.dormMonthly || modeText(monthlies) || COUNTRY_HALLS[countryName] || "";
    places[cc].cities[id] = compact({
      name: cityName,
      apartment1br: meta.apartment1br || "",
      apartmentNote: meta.apartmentNote || "",
      photo: meta.photo || "",
      halls,
    });
    const citySafety = Number(meta.safetyIndex);
    const countrySafety = numbeo.countries[cc]?.safety;
    const cityCol = Number(meta.colNyc);
    const cityKey = `${cc}|${id}`;
    const cityNumbeo = compact({
      safety: Number.isFinite(citySafety) && citySafety > 0 && citySafety !== countrySafety ? citySafety : undefined,
      colNyc: Number.isFinite(cityCol) && cityCol > 0 ? cityCol : undefined,
    });
    if (Object.keys(cityNumbeo).length) numbeo.cities[cityKey] = cityNumbeo;
  }

  const cityIdOf = (school) => {
    const cc = ISO[school.country];
    const cities = places[cc]?.cities || {};
    const found = Object.entries(cities).find(([, row]) => row.name === school.city);
    if (!found) throw new Error(`No city slug for ${school.id} ${school.country}/${school.city}`);
    return found[0];
  };

  const schools = schoolsIn.map((school) => {
    const cc = ISO[school.country];
    const city = cityIdOf(school);
    const cityHalls = places[cc].cities[city].halls || places[cc].halls || "";
    const own = housingIn[school.id];
    let housing;
    if (own) {
      const differs = own.dormsAvailable === false
        || own.dormsIncluded
        || ((own.dormMonthly || "").trim() && (own.dormMonthly || "").trim() !== cityHalls);
      if (differs) housing = compact({
        dormsIncluded: own.dormsIncluded || false,
        dormsAvailable: own.dormsAvailable !== false,
        dormMonthly: own.dormMonthly || "",
        note: own.note || "",
      });
    }
    const photo = school.photo || photosIn[school.id] || "";
    const cityPhoto = places[cc].cities[city].photo || "";
    const out = compact({
      id: school.id,
      name: school.name,
      cc,
      city,
      type: school.type,
      defaultDelivery: school.defaultDelivery,
      blurbCustom: school.blurbCustom || undefined,
      blurb: school.blurbCustom ? school.blurb : undefined,
      programs: school.programs,
      bachelor: school.bachelor || undefined,
      master: school.master || undefined,
      admissionsUrl: school.admissionsUrl,
      programsUrl: school.programsUrl && school.programsUrl !== school.admissionsUrl ? school.programsUrl : undefined,
      listing: school.listing === "index" ? "index" : undefined,
      rankings: Array.isArray(school.rankings) && school.rankings.length ? school.rankings : undefined,
      photo: photo && photo !== cityPhoto ? photo : undefined,
      housing,
    });
    return out;
  });

  fs.mkdirSync(INDEXES, { recursive: true });
  const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(path.join(INDEXES, "numbeo-2026.json"), json(numbeo));
  fs.writeFileSync(path.join(DATA, "places.json"), json(places));
  fs.writeFileSync(path.join(DATA, "schools.json"), json(schools));

  const schoolBytes = Buffer.byteLength(JSON.stringify(schools));
  const placeBytes = Buffer.byteLength(JSON.stringify(places));
  const numbeoBytes = Buffer.byteLength(JSON.stringify(numbeo));
  console.log(JSON.stringify({
    schools: schools.length,
    countries: Object.keys(places).length,
    cities: Object.values(places).reduce((n, row) => n + Object.keys(row.cities).length, 0),
    schoolHousingExceptions: schools.filter((row) => row.housing).length,
    bytes: { schools: schoolBytes, places: placeBytes, numbeo: numbeoBytes },
  }, null, 2));
}

main();
