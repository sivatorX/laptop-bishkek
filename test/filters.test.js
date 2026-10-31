import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFilters, isOpenLate, distanceKm } from "../filters.js";
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
