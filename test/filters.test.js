import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFilters, isOpenLate, distanceKm, isOpenNow, bishkekTime, bishkekDay, fastestId } from "../filters.js";
import { PLACES } from "../data/places.js";

const sample = [
  { id: "a", noise: "quiet", sockets: "yes", hours: { open: "08:00", close: "23:00" }, coords: { lat: 42.87, lng: 74.59 } },
  { id: "b", noise: "loud", sockets: "no", hours: { open: "09:00", close: "20:00" }, coords: { lat: 42.80, lng: 74.60 } },
  { id: "c", noise: null, sockets: "some", hours: "24/7", coords: null },
];

test("no filters: everything stays", () => {
  assert.equal(applyFilters(sample, {}).length, 3);
});

test("quiet + sockets", () => {
  const ids = applyFilters(sample, { quiet: true, sockets: true }).map((p) => p.id);
  assert.deepEqual(ids, ["a"]);
});

test("open late: 23:00, 24/7 and after midnight count, 20:00 and unknown don't", () => {
  assert.equal(isOpenLate(sample[0]), true);
  assert.equal(isOpenLate(sample[1]), false);
  assert.equal(isOpenLate(sample[2]), true);
  assert.equal(isOpenLate({ hours: { open: "10:00", close: "02:00" } }), true);
  assert.equal(isOpenLate({ hours: null }), false);
});

test("near me: sorted by distance, no coordinates last", () => {
  const ids = applyFilters(sample, {}, { lat: 42.801, lng: 74.601 }).map((p) => p.id);
  assert.deepEqual(ids, ["b", "a", "c"]);
});

test("distance: Ala-Too square to Osh bazaar is about 2 km", () => {
  const d = distanceKm({ lat: 42.8766, lng: 74.6036 }, { lat: 42.8744, lng: 74.5772 });
  assert.ok(d > 1.8 && d < 2.6, `got ${d}`);
});

test("data file: ids unique, required fields present, coords inside Bishkek", () => {
  const ids = new Set();
  for (const p of PLACES) {
    assert.ok(p.id && p.name && p.address, `missing field in ${p.id}`);
    assert.ok(["cafe", "coworking", "library"].includes(p.type), `bad type in ${p.id}`);
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    if (p.coords) {
      assert.ok(p.coords.lat > 42.7 && p.coords.lat < 43.0, `lat outside Bishkek in ${p.id}`);
      assert.ok(p.coords.lng > 74.4 && p.coords.lng < 74.8, `lng outside Bishkek in ${p.id}`);
    }
  }
});

test("open now: normal day, after midnight, 24/7, unknown", () => {
  const day = { hours: { open: "08:00", close: "23:00" } };
  assert.equal(isOpenNow(day, "12:00"), true);
  assert.equal(isOpenNow(day, "23:00"), false);
  assert.equal(isOpenNow(day, "07:59"), false);
  const night = { hours: { open: "08:00", close: "02:00" } };
  assert.equal(isOpenNow(night, "01:30"), true);
  assert.equal(isOpenNow(night, "03:00"), false);
  assert.equal(isOpenNow({ hours: { open: "08:00", close: "00:00" } }, "23:59"), true);
  assert.equal(isOpenNow({ hours: "24/7" }, "04:00"), true);
  assert.equal(isOpenNow({ hours: null }, "12:00"), null);
});

test("Bishkek time is UTC+6", () => {
  assert.equal(bishkekTime(new Date("2026-10-31T10:15:00Z")), "16:15");
  assert.equal(bishkekTime(new Date("2026-10-31T20:30:00Z")), "02:30");
});

test("openNow filter keeps only places open at that time", () => {
  const ids = applyFilters(sample, { openNow: true }, null, "21:00").map((p) => p.id);
  assert.deepEqual(ids.sort(), ["a", "c"]);
});

test("without position: measured fastest first, unmeasured after", () => {
  const places = [
    { id: "x", wifi: null },
    { id: "slow", wifi: { down: 10 } },
    { id: "fast", wifi: { down: 80 } },
  ];
  assert.deepEqual(applyFilters(places, {}, null, "12:00").map((p) => p.id), ["fast", "slow", "x"]);
  assert.equal(fastestId(places), "fast");
  assert.equal(fastestId([{ id: "x", wifi: null }]), null);
});

test("closed days: library is closed on Sunday", () => {
  const lib = { hours: { open: "08:00", close: "17:00" }, closedDays: [0] };
  assert.equal(isOpenNow(lib, "12:00", 0), false);
  assert.equal(isOpenNow(lib, "12:00", 1), true);
  // 2026-11-01 is a Sunday; 20:00 UTC on Saturday is already Sunday 02:00 in Bishkek
  assert.equal(bishkekDay(new Date("2026-10-31T20:00:00Z")), 0);
});
