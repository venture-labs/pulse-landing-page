// Tests for acceptance criterion 1 of
// docs/specs/20261016-switch-off-pulse-venturelabs-team-301-redirects-.md:
// `_redirects` exists at the repo root and contains exactly the 14 rules listed under
// "Approach" (or the 8 German-only rules if the `Language=en` fallback applies), each with
// the force flag `!`.
//
// Run: node --test tests/redirects.spec.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const redirectsPath = join(here, "..", "_redirects");

// Expected rules, in order, as pasted under "Approach" in the spec.
const EXPECTED_RULES = [
  ["/pulse-imprint.html", "https://venturelabs.team/en/impressum", "301!", "Language=en"],
  ["/pulse-imprint", "https://venturelabs.team/en/impressum", "301!", "Language=en"],
  ["/pulse-imprint.html", "https://venturelabs.team/de/impressum", "301!"],
  ["/pulse-imprint", "https://venturelabs.team/de/impressum", "301!"],
  ["/pulse-privacy.html", "https://venturelabs.team/en/datenschutz", "301!", "Language=en"],
  ["/pulse-privacy", "https://venturelabs.team/en/datenschutz", "301!", "Language=en"],
  ["/pulse-privacy.html", "https://venturelabs.team/de/datenschutz", "301!"],
  ["/pulse-privacy", "https://venturelabs.team/de/datenschutz", "301!"],
  ["/index.html", "https://venturelabs.team/en/leistungen", "301!", "Language=en"],
  ["/", "https://venturelabs.team/en/leistungen", "301!", "Language=en"],
  ["/index.html", "https://venturelabs.team/de/leistungen", "301!"],
  ["/", "https://venturelabs.team/de/leistungen", "301!"],
  ["/*", "https://venturelabs.team/en/leistungen", "301!", "Language=en"],
  ["/*", "https://venturelabs.team/de/leistungen", "301!"],
];

function parseRedirects(content) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.split(/\s+/));
}

test("_redirects exists at the pulse repo root", () => {
  assert.ok(existsSync(redirectsPath), `expected ${redirectsPath} to exist`);
});

test("_redirects contains exactly the 14 rules from the spec's Approach, in order, each forced", () => {
  const content = readFileSync(redirectsPath, "utf8");
  const rows = parseRedirects(content);
  assert.equal(
    rows.length,
    EXPECTED_RULES.length,
    `expected ${EXPECTED_RULES.length} rules, found ${rows.length}: ${JSON.stringify(rows)}`
  );
  rows.forEach((row, i) => {
    assert.deepEqual(
      row,
      EXPECTED_RULES[i],
      `rule ${i + 1} mismatch: got ${JSON.stringify(row)}, expected ${JSON.stringify(EXPECTED_RULES[i])}`
    );
  });
});

test("every rule carries the force flag (301!)", () => {
  const content = readFileSync(redirectsPath, "utf8");
  const rows = parseRedirects(content);
  for (const row of rows) {
    assert.ok(row[2] === "301!", `rule ${JSON.stringify(row)} is not forced (301!)`);
  }
});

test("every German rule has a Language=en variant immediately above it (first match wins)", () => {
  const content = readFileSync(redirectsPath, "utf8");
  const rows = parseRedirects(content);
  // Pair up rules by (from, destination-path-without-lang-prefix): each German rule's preceding
  // row must be the same `from` path with the same destination slug under /en/ and Language=en,
  // UNLESS the German-only fallback applies (8 rows, no Language=en at all) — in that case this
  // test is skipped.
  const hasAnyLanguageRule = rows.some((r) => r[3] === "Language=en");
  if (!hasAnyLanguageRule) {
    // German-only fallback shape: must be exactly 8 rows, each without a 4th column.
    assert.equal(rows.length, 8, "German-only fallback must have exactly 8 rules");
    return;
  }
  rows.forEach((de, i) => {
    if (de[3] === "Language=en") return; // this row is itself an English variant
    const sameFromIndex = rows.findIndex(
      (en, j) => j < i && en[0] === de[0] && en[3] === "Language=en"
    );
    assert.ok(
      sameFromIndex !== -1,
      `German rule ${JSON.stringify(de)} (row ${i + 1}) has no earlier Language=en row with the same "from" path`
    );
    const en = rows[sameFromIndex];
    const deSlug = de[1].replace(/^https:\/\/venturelabs\.team\/de\//, "");
    const enSlug = en[1].replace(/^https:\/\/venturelabs\.team\/en\//, "");
    assert.equal(
      deSlug,
      enSlug,
      `German rule ${JSON.stringify(de)} and its English counterpart ${JSON.stringify(en)} target different slugs`
    );
  });
});
