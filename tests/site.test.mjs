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

  assert.equal(numbers.length, 22);
  assert.equal(new Set(numbers).size, numbers.length);
  assert.equal(destinations.length, 22);
  assert.equal(new Set(destinations).size, destinations.length);
});

test("filter controls and filtering logic are present", () => {
  assert.match(html, /data-filter="all"/);
  assert.match(html, /data-filter="photo"/);
  assert.match(html, /data-filter="image"/);
  assert.match(html, /data-filter="writing"/);
  assert.match(html, /data-filter="life"/);
  assert.match(js, /card\.hidden = !visible/);
});

test("Tax Reserve is listed as a 2026 local estimate", () => {
  const start = html.indexOf('href="/tax-reserve/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /2026 TAX ESTIMATE \/ LOCAL PROCESSING/);
  assert.match(card, /Tax Reserve/);
  assert.match(card, /2026年分の制度/);
  assert.match(card, /端末内で試算/);
});

test("Route Motion distinguishes local photos from online map processing", () => {
  const start = html.indexOf('href="/route-motion/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /JOURNEY \/ LOCAL PHOTOS/);
  assert.doesNotMatch(card, /LOCAL PROCESSING/);
  assert.match(card, /写真は送信せず/);
});

test("Grade Motion is listed as a locally processed photo tool", () => {
  const start = html.indexOf('href="/grade-motion/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /GRADE \/ LOCAL PROCESSING/);
  assert.match(card, /Grade Motion/);
  assert.match(card, /端末内で比較動画やGIFへ/);
});

test("Video Contact Sheet is listed as a locally processed photo tool", () => {
  const start = html.indexOf('href="/video-contact-sheet/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /VIDEO REVIEW \/ LOCAL PROCESSING/);
  assert.match(card, /Video Contact Sheet/);
  assert.match(card, /代表フレーム/);
});
