import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { T, PAGE_EN, t, localizePlace } from "../i18n.js";
import { PLACES } from "../data/places.js";
import { PLACES_EN } from "../data/places-en.js";
import { matchesQuery } from "../filters.js";
import { validateFeedback } from "../feedback.js";
import { validateSuggestion } from "../suggest.js";

test("i18n: every text has Russian and English", () => {
  for (const [key, entry] of Object.entries(T)) {
    assert.ok(entry.ru && entry.en, `missing language for "${key}"`);
  }
});

test("i18n: every label in index.html has an English text", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const keys = [...html.matchAll(/data-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length > 30);
  for (const key of keys) assert.ok(key in PAGE_EN, `no English text for "${key}"`);
});

test("i18n: every place has an English address, and English notes where Russian has them", () => {
  for (const place of PLACES) {
    const en = PLACES_EN[place.id];
    assert.ok(en, `no English entry for "${place.id}"`);
    assert.ok(en.address, `no English address for "${place.id}"`);
    for (const field of ["note", "wifiNote", "coffeeNote"]) {
      if (place[field]) assert.ok(en[field], `no English ${field} for "${place.id}"`);
    }
    // Russian names (Cyrillic) need an English name
    if (/[а-яё]/i.test(place.name)) assert.ok(en.name, `no English name for "${place.id}"`);
  }
  for (const id of Object.keys(PLACES_EN)) assert.ok(PLACES.some((p) => p.id === id), `unknown id "${id}" in places-en.js`);
});

test("i18n: t() fills in values and picks the language", () => {
  assert.equal(t("total", { n: 5 }, "ru"), "Всего мест: 5");
  assert.equal(t("total", { n: 5 }, "en"), "Places: 5");
  assert.equal(t("no-such-key", {}, "en"), "no-such-key");
});

test("i18n: English place keeps the Russian copy, and search finds both", () => {
  const place = PLACES.find((p) => p.id === "library-18");
  const en = localizePlace(place, "en", PLACES_EN);
  assert.equal(en.name, "Library No. 18 (Bokonbaev)");
  assert.equal(en.nameRu, place.name);
  assert.equal(en.addressRu, place.address);
  assert.equal(matchesQuery(en, "isanov"), true);
  assert.equal(matchesQuery(en, "исанова"), true);
  assert.equal(localizePlace(place, "ru", PLACES_EN).name, place.name);
});

test("i18n: form errors in English", () => {
  assert.match(validateFeedback({ placeId: "x" }, "en").errors[0], /download speed/i);
  assert.match(validateFeedback({ placeId: "x", down: "abc" }, "en").errors[0], /0 to 2000/);
  assert.equal(validateFeedback({ placeId: "x", down: "abc" }, "en").errors.length, 1);
  assert.match(validateSuggestion({ name: "", address: "" }, "en").errors.join(" "), /name.*address/);
});
