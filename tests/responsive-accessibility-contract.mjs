import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("styles.css","utf8");

assert.match(css,/@media\s*\(max-width:\s*768px\)/i,"Need explicit <=768px composition");
assert.match(css,/@media\s*\(max-width:\s*480px\)/i,"Need explicit <=480px composition");
assert.match(css,/@media\s*\(max-width:\s*768px\)[\s\S]*?\.hero-grid\s*\{/i,"Hero needs mobile-specific layout");
assert.match(css,/@media\s*\(max-width:\s*768px\)[\s\S]*?\.architecture-map\s*\{/i,"Architecture diagram needs mobile-specific layout");
assert.match(css,/\.shell\s*\{[^}]*width:\s*min\(/i,"Primary shell must be fluid rather than fixed desktop width");

assert.match(html,/class=["'][^"']*nav-toggle[^"']*["'][^>]*aria-expanded=["']false["'][^>]*aria-controls=["']primary-nav["']/i,"Mobile nav toggle must expose aria state");
assert.match(html,/id=["']primary-nav["']/i,"Primary nav must be addressable");
assert.match(html,/src=["']site\.js["']/i,"Progressive enhancement script must be loaded");

assert.match(css,/:focus-visible/i,"Visible focus styles required");
assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/i,"Reduced-motion handling required");
assert.match(html,/class=["']architecture-map["'][^>]*role=["']img["'][^>]*aria-label=/i,"Informative architecture diagram must have a readable label");

const decorativeSvgs=[...html.matchAll(/<svg\b([^>]*)>/gi)];
assert.ok(decorativeSvgs.length>0,"Expected inline SVGs");
for(const [,attrs] of decorativeSvgs){
  assert.match(attrs,/aria-hidden=["']true["']/i,"Decorative SVG must be aria-hidden");
}

console.log("responsive accessibility contract: pass");
