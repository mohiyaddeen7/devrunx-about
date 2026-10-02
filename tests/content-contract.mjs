import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8").replaceAll("&amp;","&");

assert.match(html,/Monitor\. Control\. Keep work moving\./i);
for (const step of ["Connect","Observe","Act"]) {
  assert.ok(html.includes(step),"Missing how-it-works step: "+step);
}

const slice=(startId,nextId)=>{
  const start=html.indexOf('id="'+startId+'"');
  const end=nextId ? html.indexOf('id="'+nextId+'"',start) : html.length;
  return start>=0 ? html.slice(start,end>start?end:html.length) : "";
};

const available=slice("available","in-development");
for (const phrase of [
  "account registration",
  "device and session",
  "time-limited pairing",
  "terminal-device pairing",
  "session/token issuance",
  "role-aware device",
  "rate-limiting"
]) {
  assert.ok(available.toLowerCase().includes(phrase.toLowerCase()),"Available foundation missing: "+phrase);
}

const inDevelopment=slice("in-development","future");
for (const phrase of [
  "real-time session visibility",
  "terminal/event streaming",
  "richer device management",
  "controlled remote actions",
  "audit-log",
  "AI-generated",
  "reconnect/recovery",
  "operational dashboard",
  "notification"
]) {
  assert.ok(inDevelopment.toLowerCase().includes(phrase.toLowerCase()),"In-development section missing: "+phrase);
}

const future=slice("future","use-cases");
for (const phrase of [
  "AI-agent connectors",
  "application connectors",
  "cloud-service connectors",
  "automation connectors",
  "cross-system orchestration",
  "policy-driven action approval",
  "source-agnostic remote execution",
  "team-oriented"
]) {
  assert.ok(future.toLowerCase().includes(phrase.toLowerCase()),"Future section missing: "+phrase);
}

for (const scenario of [
  "build is still running",
  "AI agent needs attention",
  "server process exits unexpectedly",
  "long-running task finishes",
  "deployment or automation changes state",
  "away from the originating machine"
]) {
  assert.ok(html.toLowerCase().includes(scenario.toLowerCase()),"Missing use case: "+scenario);
}

for (const node of [
  "Laptop / Desktop","Server","AI Agent","Application","Cloud Service","Automation",
  "DevRunX","Events / state","User","Controlled actions"
]) {
  assert.ok(html.toLowerCase().includes(node.toLowerCase()),"Architecture diagram missing: "+node);
}

for (const forbidden of ["DATABASE_URL","JWT_SECRET","internal service","token format","private infrastructure"]) {
  assert.doesNotMatch(html,new RegExp(forbidden,"i"),"Architecture section exposed private implementation detail");
}

console.log("content contract: pass");
