import { test } from "node:test";
import assert from "node:assert/strict";
import { isNew, pickPlace, applyFilters } from "../filters.js";

test("new badge: only for 14 days after the added date", () => {
  assert.equal(isNew({ added: "2026-11-02" }, "2026-11-02"), true);
  assert.equal(isNew({ added: "2026-11-02" }, "2026-11-15"), true);
  assert.equal(isNew({ added: "2026-11-02" }, "2026-11-16"), false);
  assert.equal(isNew({}, "2026-11-02"), false);
});

test("pick: only open places; without position, measured Wi-Fi first", () => {
  const places = [
    { id: "closed", openNow: false, wifi: { down: 90 } },
    { id: "open", openNow: true, wifi: null },
    { id: "fast", openNow: true, wifi: { down: 40 } },
  ];
  assert.equal(pickPlace(places, () => 0).id, "fast");
  assert.equal(pickPlace(places.slice(0, 2), () => 0.99).id, "open");
  assert.equal(pickPlace([{ id: "x", openNow: false }]), null);
});

test("pick: with position, one of the 3 nearest open places", () => {
  const places = [5, 1, 3, 2, 4].map((d) => ({ id: `d${d}`, openNow: true, distance: d }));
  assert.equal(pickPlace(places, () => 0).id, "d1");
  assert.equal(pickPlace(places, () => 0.99).id, "d3");
});

test("favorites filter keeps only saved places", () => {
  const places = [{ id: "a", name: "A", address: "" }, { id: "b", name: "B", address: "" }];
  const result = applyFilters(places, { favorites: true, favoriteIds: ["b"] }, null, "12:00", 3);
  assert.deepEqual(result.map((p) => p.id), ["b"]);
  assert.equal(applyFilters(places, { favorites: true }, null, "12:00", 3).length, 0);
});
