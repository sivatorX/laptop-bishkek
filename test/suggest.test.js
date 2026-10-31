import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSuggestion, suggestionSummary } from "../suggest.js";
import { matchesQuery } from "../filters.js";

test("suggestion: name and address are required", () => {
  assert.equal(validateSuggestion({ name: "", address: "Манаса 1" }).ok, false);
  assert.equal(validateSuggestion({ name: "Кофейня", address: "" }).ok, false);
  assert.equal(validateSuggestion({ name: "Кофейня", address: "Манаса 1" }).ok, true);
});

test("suggestion: unknown type and options are dropped, text is trimmed", () => {
  const r = validateSuggestion({ name: "  Coffee   Lab ", address: "Токтогула 1", type: "hack", good: ["wifi", "evil", "quiet"] });
  assert.equal(r.data.name, "Coffee Lab");
  assert.equal(r.data.type, "other");
  assert.deepEqual(r.data.good, ["wifi", "quiet"]);
});

test("suggestion: one checkbox comes as a string, not a list", () => {
  assert.deepEqual(validateSuggestion({ name: "AB", address: "ABC", good: "sockets" }).data.good, ["sockets"]);
});

test("suggestion summary is readable", () => {
  const text = suggestionSummary({ name: "X", address: "Y", type: "cafe", good: ["wifi"], comment: "" });
  assert.match(text, /Кафе: X/);
  assert.match(text, /Быстрый Wi-Fi/);
});

test("search: name or street, any case, ё = е, several words", () => {
  const place = { name: "Sierra Coffee", address: "пр. Манаса, 57/1" };
  assert.equal(matchesQuery(place, ""), true);
  assert.equal(matchesQuery(place, "SIERRA"), true);
  assert.equal(matchesQuery(place, "манаса"), true);
  assert.equal(matchesQuery(place, "манаса sierra"), true);
  assert.equal(matchesQuery(place, "бублик"), false);
  assert.equal(matchesQuery({ name: "Ёлка", address: "" }, "елка"), true);
});
