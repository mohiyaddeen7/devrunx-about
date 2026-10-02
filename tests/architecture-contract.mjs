import fs from "node:fs";
import assert from "node:assert/strict";

assert.ok(fs.existsSync("CNAME"), "CNAME must exist");
assert.equal(fs.readFileSync("CNAME","utf8"),"about.devrunx.com\n","CNAME must target about.devrunx.com");
assert.ok(fs.existsSync(".nojekyll"), ".nojekyll must exist");
assert.ok(!fs.existsSync("package.json"), "Static overview must not add package.json");

assert.ok(fs.existsSync("index.html"), "index.html must exist");
const html=fs.readFileSync("index.html","utf8");

for (const forbidden of [
  /DevRunX_Backend/i,
  /DevRunX_Web_Frontend/i,
  /DATABASE_URL/i,
  /SUPABASE_SERVICE_ROLE/i,
  /JWT_SECRET/i,
  /github\.com\/mohiyaddeen7\/(?:DevRunX_Backend|DevRunX_Web_Frontend)/i,
]) {
  assert.doesNotMatch(html,forbidden,"Public site must not expose private implementation details");
}

const externalScripts=[...html.matchAll(/<script\b[^>]*src=["'](https?:\/\/[^"']+)["']/gi)].map(m=>m[1]);
assert.equal(externalScripts.length,0,"No third-party scripts before the Tally integration task");

console.log("architecture contract: pass");
