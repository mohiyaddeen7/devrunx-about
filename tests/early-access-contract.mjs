import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("site.js","utf8");

assert.match(html,/href=["']#early-access["']/i,"Primary CTA must target early access");
assert.match(html,/src=["']site-config\.js["']/i,"Tally configuration must be isolated in site-config.js");
assert.ok(fs.existsSync("site-config.js"),"site-config.js must exist");
const config=fs.readFileSync("site-config.js","utf8");
assert.match(config,/tallyFormUrl\s*:/i,"Tally form URL config key must exist");
assert.doesNotMatch(config,/YOUR_FORM|example\.com|fake/i,"Do not ship a fabricated form identifier");

assert.match(html,/data-early-access-embed/i,"Early-access embed mount must exist");
assert.match(html,/Open early access form/i,"Embed must have a fallback link");
assert.match(html,/Email/i);
assert.match(html,/Role/i);
assert.match(html,/What would you want DevRunX to monitor or control\?/i);
assert.match(html,/external form provider/i,"Static site must disclose third-party form handling");

assert.match(js,/https:\/\/tally\.so\//i,"Runtime must validate Tally URLs");
assert.match(js,/iframe/i,"Runtime must create an embedded form when configured");
assert.match(js,/early-access-fallback/i,"Runtime must configure the fallback link");

const externalScripts=[...html.matchAll(/<script\b[^>]*src=["'](https?:\/\/[^"']+)["']/gi)].map(m=>m[1]);
assert.equal(externalScripts.length,0,"Third-party form scripts must not load when no real Tally URL is configured");

console.log("early access contract: pass");
