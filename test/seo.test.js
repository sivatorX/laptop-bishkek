import { test } from "node:test";
import assert from "node:assert/strict";
import { placesJsonLd } from "../seo.js";
import { PLACES } from "../data/places.js";

const URL = "https://sivatorx.github.io/laptop-bishkek/";

test("seo: every place is in the list, with name, address and link", () => {
  const ld = placesJsonLd(PLACES, URL);
  assert.equal(ld["@type"], "ItemList");
  assert.equal(ld.itemListElement.length, PLACES.length);
  const first = ld.itemListElement[0];
  assert.equal(first.position, 1);
  assert.equal(first.item.name, PLACES[0].name);
  assert.equal(first.item.url, `${URL}#place=${PLACES[0].id}`);
  assert.equal(first.item.address.addressLocality, "Бишкек");
});

test("seo: types and opening hours", () => {
  const ld = placesJsonLd([
    { id: "a", name: "A", type: "cafe", address: "x", coords: null, hours: { open: "08:00", close: "22:00" } },
    { id: "b", name: "B", type: "library", address: "y", coords: null, hours: { open: "08:00", close: "17:00" }, closedDays: [0] },
    { id: "c", name: "C", type: "coworking", address: "z", coords: { lat: 1, lng: 2 }, hours: "24/7" },
  ], URL);
  const [a, b, c] = ld.itemListElement.map((x) => x.item);
  assert.equal(a["@type"], "CafeOrCoffeeShop");
  assert.equal(a.openingHoursSpecification[0].dayOfWeek.length, 7);
  assert.equal(b["@type"], "Library");
  assert.equal(b.openingHoursSpecification[0].dayOfWeek.includes("Sunday"), false);
  assert.equal(c.openingHoursSpecification[0].closes, "23:59");
  assert.equal(c.geo.latitude, 1);
  assert.equal(a.geo, undefined);
});
