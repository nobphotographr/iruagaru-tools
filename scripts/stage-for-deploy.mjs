#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const ANALYTICS_TAG = '  <script src="/assets/analytics.js" defer></script>';

export function injectAnalytics(html, filename = "HTML file") {
  if (html.includes('src="/assets/analytics.js"')) {
    return html;
  }

  if (!/<\/head\s*>/i.test(html)) {
    throw new Error(`${filename} does not contain a closing </head> tag`);
  }

  return html.replace(/<\/head\s*>/i, `${ANALYTICS_TAG}\n</head>`);
}

async function injectIntoHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      await injectIntoHtmlFiles(path);
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".html")) {
      continue;
    }

    const html = await readFile(path, "utf8");
    const stagedHtml = injectAnalytics(html, path);
    await writeFile(path, stagedHtml);
  }
}

export async function stageForDeploy(source, destination) {
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
  await injectIntoHtmlFiles(destination);
}

const scriptPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";

if (import.meta.url === scriptPath) {
  const [source, destination] = process.argv.slice(2);

  if (!source || !destination) {
    throw new Error("Usage: stage-for-deploy.mjs <source-directory> <destination-directory>");
  }

  await stageForDeploy(resolve(source), resolve(destination));
}
