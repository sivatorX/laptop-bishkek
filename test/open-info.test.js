import { test } from "node:test";
import assert from "node:assert/strict";
import { openInfo, applyFilters } from "../filters.js";

const cafe = { hours: { open: "08:00", close: "23:00" } };
const lateCafe = { hours: { open: "08:00", close: "02:00" } };
const library = { hours: { open: "09:00", close: "18:00" }, closedDays: [0, 6] };
const WED = 3;
const FRI = 5;
const SAT = 6;

test("open info: open, closing soon, 24/7, unknown", () => {
  assert.deepEqual(openInfo(cafe, "12:00", WED), { state: "open", until: "23:00" });
  assert.deepEqual(openInfo(cafe, "22:20", WED), { state: "closing", until: "23:00", minutesLeft: 40 });
  assert.deepEqual(openInfo({ hours: "24/7" }, "03:00", WED), { state: "always" });
  assert.deepEqual(openInfo({ hours: null }, "12:00", WED), { state: "unknown" });
});

test("open info: closing after midnight", () => {
  assert.equal(openInfo(lateCafe, "23:30", WED).state, "open");
  assert.deepEqual(openInfo(lateCafe, "01:15", WED), { state: "closing", until: "02:00", minutesLeft: 45 });
  const night = openInfo(lateCafe, "03:00", WED);
  assert.equal(night.state, "closed");
  assert.equal(night.inDays, 0); // opens later today
  assert.equal(night.opensAt, "08:00");
});

test("open info: closed, opens today, tomorrow or after the weekend", () => {
  assert.equal(openInfo(cafe, "07:00", WED).inDays, 0);
  assert.equal(openInfo(cafe, "23:30", WED).inDays, 1);
  assert.equal(openInfo(library, "19:00", FRI).inDays, 3); // Friday evening → Monday
  assert.equal(openInfo(library, "10:00", SAT).inDays, 2); // Saturday → Monday
  assert.equal(openInfo(library, "10:00", SAT).day, 1);
});

test("free filter keeps only free places", () => {
  const places = [{ id: "a", name: "A", address: "", free: true }, { id: "b", name: "B", address: "" }];
  assert.deepEqual(applyFilters(places, { free: true }, null, "12:00", WED).map((p) => p.id), ["a"]);
  assert.equal(applyFilters(places, {}, null, "12:00", WED).length, 2);
});
