import { test } from "node:test";
import assert from "node:assert/strict";
import { describeWeather, greetingKey } from "../weather.js";
import { plural } from "../i18n.js";
import { applyFilters } from "../filters.js";

test("weather: icon and tip", () => {
  assert.deepEqual(describeWeather(0, 15.1, true), { icon: "☀️", tip: "tip.nice", temp: 15 });
  assert.equal(describeWeather(0, 15, false).icon, "🌙");
  assert.equal(describeWeather(63, 8).tip, "tip.bad"); // rain
  assert.equal(describeWeather(73, -4).icon, "❄️"); // snow
  assert.equal(describeWeather(2, -6).tip, "tip.cold");
  assert.equal(describeWeather(1, 35).tip, "tip.hot");
  assert.equal(describeWeather(95, 20).tip, "tip.bad"); // thunderstorm
});

test("greeting by hour", () => {
  assert.equal(greetingKey(8), "hello.morning");
  assert.equal(greetingKey(14), "hello.day");
  assert.equal(greetingKey(20), "hello.evening");
  assert.equal(greetingKey(2), "hello.night");
});

test("russian word forms after numbers", () => {
  const forms = ["место", "места", "мест"];
  assert.equal(plural(1, "ru", forms), "место");
  assert.equal(plural(3, "ru", forms), "места");
  assert.equal(plural(10, "ru", forms), "мест");
  assert.equal(plural(11, "ru", forms), "мест");
  assert.equal(plural(21, "ru", forms), "место");
  assert.equal(plural(1, "en", ["place", "places"]), "place");
  assert.equal(plural(5, "en", ["place", "places"]), "places");
});

test("list: open places first, then unknown hours, then closed", () => {
  const places = [
    { id: "closed", name: "", address: "", hours: { open: "08:00", close: "10:00" }, wifi: { down: 90 } },
    { id: "unknown", name: "", address: "", hours: null },
    { id: "open", name: "", address: "", hours: { open: "08:00", close: "23:00" } },
  ];
  assert.deepEqual(applyFilters(places, {}, null, "12:00", 3).map((p) => p.id), ["open", "unknown", "closed"]);
});
