import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { injectAnalytics, stageForDeploy } from "../scripts/stage-for-deploy.mjs";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
const analytics = await readFile(new URL("../assets/analytics.js", import.meta.url), "utf8");

test("canonical URL points to the tools domain", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/tools\.iruagaru\.com\/">/);
});

test("the portal loads privacy-minimized shared analytics", () => {
  assert.match(html, /<script src="\/assets\/analytics\.js" defer><\/script>/);
  assert.match(html, /選んだファイルや入力内容は計測対象にしません/);
  assert.match(analytics, /G-TPNYPSDE2K/);
  assert.match(analytics, /window\.location\.origin/);
  assert.match(analytics, /window\.location\.pathname/);
  assert.match(analytics, /referrerUrl\.origin/);
  assert.match(analytics, /referrerUrl\.pathname/);
  assert.doesNotMatch(analytics, /window\.location\.search/);
  assert.doesNotMatch(analytics, /window\.location\.hash/);
  assert.match(analytics, /allow_google_signals: false/);
  assert.match(analytics, /allow_ad_personalization_signals: false/);
  assert.doesNotMatch(analytics, /gtag\("event"/);
});

test("deployment staging injects analytics without changing source files", async () => {
  const root = await mkdtemp(join(tmpdir(), "iruagaru-tools-test-"));
  const source = join(root, "source");
  const destination = join(root, "destination");

  try {
    await mkdir(source);
    const original = "<!doctype html><html><head><title>Tool</title></head><body></body></html>";
    await writeFile(join(source, "index.html"), original);

    await stageForDeploy(source, destination);

    assert.equal(await readFile(join(source, "index.html"), "utf8"), original);
    assert.match(
      await readFile(join(destination, "index.html"), "utf8"),
      /<script src="\/assets\/analytics\.js" defer><\/script>/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("analytics injection is idempotent and rejects malformed HTML", () => {
  const once = injectAnalytics("<html><head></head><body></body></html>");
  assert.equal(injectAnalytics(once), once);
  assert.throws(() => injectAnalytics("<html><body></body></html>"), /closing <\/head>/);
});

test("all published tool cards have unique numbers and destinations", () => {
  const numbers = [...html.matchAll(/class="tool-number">(\d{2})</g)].map((match) => match[1]);
  const destinations = [...html.matchAll(/class="tool-card[^\"]*"[^>]*href="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(numbers.length, 24);
  assert.equal(new Set(numbers).size, numbers.length);
  assert.equal(destinations.length, 24);
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

test("Expense Guide is listed as a 2026 local organizer", () => {
  const start = html.indexOf('href="/expense-guide/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /2026 EXPENSE GUIDE \/ LOCAL PROCESSING/);
  assert.match(card, /Expense Guide/);
  assert.match(card, /家事按分/);
  assert.match(card, /端末内で整理/);
});

test("Deadline Guide is listed as a 2026–27 local annual planner", () => {
  const start = html.indexOf('href="/deadline-guide/"');
  const end = html.indexOf("</a>", start);
  const card = html.slice(start, end);

  assert.notEqual(start, -1);
  assert.match(card, /2026–27 ANNUAL PLAN \/ LOCAL PROCESSING/);
  assert.match(card, /Deadline Guide/);
  assert.match(card, /申告期までのお金/);
  assert.match(card, /端末内でひとつに整理/);
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
