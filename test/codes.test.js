import { test } from "node:test";
import assert from "node:assert/strict";
import { currentCode, verify, ROTATE_MS } from "../src/codes.js";

test("current code verifies", () => {
  const now = Date.now();
  assert.ok(verify("s1", currentCode("s1", now), now));
});

test("previous window still verifies", () => {
  const now = Date.now();
  assert.ok(verify("s1", currentCode("s1", now - ROTATE_MS), now));
});

test("codes expire after two windows", () => {
  const now = Date.now();
  assert.ok(!verify("s1", currentCode("s1", now - 2 * ROTATE_MS), now));
});

test("codes are per-session", () => {
  assert.ok(!verify("s2", currentCode("s1")));
});
