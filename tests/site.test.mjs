import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");

test("canonical URL points to the tools domain", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/tools\.iruagaru\.com\/">/);
});

test("all published tool cards have unique numbers and destinations", () => {
  const numbers = [...html.matchAll(/class="tool-number">(\d{2})</g)].map((match) => match[1]);
  const destinations = [...html.matchAll(/class="tool-card[^\"]*"[^>]*href="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(numbers.length, 19);
  assert.equal(new Set(numbers).size, numbers.length);
  assert.equal(destinations.length, 19);
  assert.equal(new Set(destinations).size, destinations.length);
});

test("filter controls and filtering logic are present", () => {
  assert.match(html, /data-filter="all"/);
  assert.match(html, /data-filter="photo"/);
  assert.match(html, /data-filter="image"/);
  assert.match(html, /data-filter="writing"/);
  assert.match(js, /card\.hidden = !visible/);
});
