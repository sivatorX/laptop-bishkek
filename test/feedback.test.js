import { test } from "node:test";
import assert from "node:assert/strict";
import { validateFeedback, COMMENT_MAX } from "../feedback.js";

test("speed with a comma works", () => {
  const r = validateFeedback({ placeId: "x", down: "35,5", up: "12" });
  assert.equal(r.ok, true);
  assert.equal(r.data.down, 35.5);
  assert.equal(r.data.up, 12);
});

test("download speed is required: rating or comment alone is not enough", () => {
  assert.equal(validateFeedback({ placeId: "x", rating: "slow" }).ok, false);
  assert.equal(validateFeedback({ placeId: "x", comment: "норм" }).ok, false);
  assert.equal(validateFeedback({ placeId: "x", down: "0" }).ok, true);
});

test("empty form is refused", () => {
  const r = validateFeedback({ placeId: "x" });
  assert.equal(r.ok, false);
});

test("bad speed is refused", () => {
  assert.equal(validateFeedback({ placeId: "x", down: "abc" }).ok, false);
  assert.equal(validateFeedback({ placeId: "x", down: "-5" }).ok, false);
  assert.equal(validateFeedback({ placeId: "x", down: "99999" }).ok, false);
});

test("unknown rating is ignored, long comment is cut", () => {
  const r = validateFeedback({ placeId: "x", down: "20", rating: "hack", comment: "a".repeat(500) });
  assert.equal(r.ok, true);
  assert.equal(r.data.rating, null);
  assert.equal(r.data.comment.length, COMMENT_MAX);
});
