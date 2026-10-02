import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
assert.match(html,/href=["']styles\.css["']/i,"index.html must load styles.css");
assert.ok(fs.existsSync("styles.css"),"styles.css must exist");
const css=fs.readFileSync("styles.css","utf8");

assert.match(css,/--bg:\s*#0[0-9a-f]{5}/i,"Dark near-black background token required");
assert.match(css,/--text:\s*#[ef][0-9a-f]{5}/i,"High-contrast foreground token required");
assert.match(css,/--accent:\s*#[0-9a-f]{6}/i,"Electric-blue accent token required");

const hero=html.match(/<section[^>]+class=["'][^"']*hero[^"']*["'][\s\S]*?<\/section>/i)?.[0] ?? "";
const heroLinks=[...hero.matchAll(/<a\b[^>]*>/gi)];
assert.equal(heroLinks.length,2,"Hero must contain exactly two actions");
assert.match(hero,/href=["']#early-access["']/i);
assert.match(hero,/href=["']#how-it-works["']/i);

for (const label of ["Recent events","Active session","Quick actions"]) {
  assert.ok(hero.toLowerCase().includes(label.toLowerCase()),"Hero dashboard missing: "+label);
}
assert.doesNotMatch(hero,/\b\d+\s*(users|customers|active sessions|connected devices)\b/i,"Hero must not present fabricated aggregate usage");

for (const label of [
  "Computers & devices","Servers","AI agents","Applications",
  "Cloud services","Automations","APIs / tools"
]) {
  assert.ok(html.toLowerCase().includes(label.toLowerCase()),"Missing system category: "+label);
}
assert.doesNotMatch(html,/glass-card/i);
assert.doesNotMatch(html,/testimonial/i);
assert.doesNotMatch(html,/customer logos?/i);

console.log("visual contract: pass");
