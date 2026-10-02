import fs from "node:fs";
import assert from "node:assert/strict";

assert.ok(fs.existsSync("index.html"), "index.html must exist");
const html=fs.readFileSync("index.html","utf8");

assert.match(html,/Know what your systems are doing\./i);
assert.match(html,/Act when they need you\./i);
assert.match(html,/Join early access/i);
assert.match(html,/View how it works/i);
assert.match(html,/Available foundation/i);
assert.match(html,/In development/i);
assert.match(html,/>\s*Future\s*</i);

const available=html.match(/<section[^>]+id=["']available["'][\s\S]*?<\/section>/i)?.[0] ?? "";
for (const phrase of [
  "AI-agent connectors",
  "cloud-service connectors",
  "cross-system orchestration",
  "policy-driven action approval",
]) {
  assert.doesNotMatch(available,new RegExp(phrase,"i"),`Available section must not contain future capability: ${phrase}`);
}

for (const prohibited of [
  /99\.9%/,
  /enterprise ready/i,
  /production secure/i,
  /\b\d+[,+]?\s*(customers|users)\b/i,
]) {
  assert.doesNotMatch(html,prohibited,"Public page must not fabricate traction or readiness claims");
}

console.log("product truth contract: pass");
