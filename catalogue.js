/**
 * Load the GlobalEd catalogue: schools reference ISO + city slug;
 * safety and daily-cost scores are joined once from indexes/numbeo-2026.json.
 */
(function (global) {
  const Catalogue = {
    schools: [],
    usColNyc: 68.8,
    source: null,
    _byName: new Map(),
    _byCode: new Map(),
    _city: new Map(),
    _byId: new Map(),
    _byCountry: new Map(),
    _cityBySlug: new Map(),
  };

  function cityMapKey(countryName, cityName) {
    return `${countryName}\0${cityName}`;
  }

  Catalogue.country = function (name) {
    return Catalogue._byName.get(name) || null;
  };

  Catalogue.city = function (countryName, cityName) {
    return Catalogue._city.get(cityMapKey(countryName, cityName)) || null;
  };

  Catalogue.countryList = function () {
    return [...Catalogue._byName.entries()];
  };

  Catalogue.countryNames = function () {
    return [...Catalogue._byName.keys()];
  };

  Catalogue.safety = function (countryName, cityName) {
    if (cityName) {
      const city = Catalogue.city(countryName, cityName);
      if (Number.isFinite(city?.safetyIndex)) return city.safetyIndex;
    }
    return Number(Catalogue.country(countryName)?.safetyIndex) || 0;
  };

  Catalogue.colNyc = function (countryName, cityName) {
    if (cityName) {
      const city = Catalogue.city(countryName, cityName);
      if (Number.isFinite(city?.colNyc) && city.colNyc > 0) return city.colNyc;
    }
    return Catalogue.country(countryName)?.colNyc;
  };

  Catalogue.schoolsInCountry = function (countryName) {
    return Catalogue._byCountry.get(countryName) || [];
  };

  Catalogue.load = function (raw) {
    const numbeo = raw.numbeo || {};
    const places = raw.places || {};
    Catalogue.usColNyc = Number(numbeo.usColNyc) || 68.8;
    Catalogue.source = {
      name: numbeo.source || "Numbeo",
      edition: numbeo.edition || "",
      urls: numbeo.urls || {},
      note: numbeo.note || "",
    };
    Catalogue._byName.clear();
    Catalogue._byCode.clear();
    Catalogue._city.clear();
    Catalogue._byId.clear();
    Catalogue._byCountry.clear();
    Catalogue._cityBySlug.clear();

    for (const [cc, place] of Object.entries(places)) {
      const stats = numbeo.countries?.[cc] || {};
      const countryView = {
        code: cc,
        name: place.name,
        region: place.region,
        blurb: place.blurb || "",
        photo: place.photo || "",
        halls: place.halls || "",
        safetyIndex: Number(stats.safety),
        colNyc: Number(stats.colNyc),
      };
      Catalogue._byCode.set(cc, countryView);
      Catalogue._byName.set(place.name, countryView);
      Catalogue._byCountry.set(place.name, []);
      for (const [id, city] of Object.entries(place.cities || {})) {
        const cityStats = numbeo.cities?.[`${cc}|${id}`] || {};
        const cityView = {
          id,
          name: city.name,
          country: place.name,
          countryCode: cc,
          apartment1br: city.apartment1br || "",
          apartmentNote: city.apartmentNote || "",
          photo: city.photo || place.photo || "",
          dormMonthly: city.halls || place.halls || "",
          safetyIndex: Number.isFinite(Number(cityStats.safety)) ? Number(cityStats.safety) : countryView.safetyIndex,
          colNyc: Number.isFinite(Number(cityStats.colNyc)) && Number(cityStats.colNyc) > 0
            ? Number(cityStats.colNyc)
            : countryView.colNyc,
        };
        Catalogue._city.set(cityMapKey(place.name, city.name), cityView);
        Catalogue._cityBySlug.set(`${cc}|${id}`, cityView);
      }
    }

    Catalogue.schools = (raw.schools || []).map((row) => {
      const country = Catalogue._byCode.get(row.cc);
      const cityView = Catalogue._cityBySlug.get(`${row.cc}|${row.city}`);
      const school = {
        ...row,
        country: country?.name || row.cc,
        city: cityView?.name || row.city,
        cityId: row.city,
      };
      Catalogue._byId.set(school.id, school);
      const bucket = Catalogue._byCountry.get(school.country);
      if (bucket) bucket.push(school);
      return school;
    });
    return Catalogue;
  };

  Catalogue.ready = fetch("/catalogue.json", { headers: { Accept: "application/json" } })
    .then((res) => {
      if (!res.ok) throw new Error(`catalogue.json ${res.status}`);
      return res.json();
    })
    .then((raw) => Catalogue.load(raw));

  global.Catalogue = Catalogue;
})(window);
