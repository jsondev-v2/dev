'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  START_MARKER,
  doctor,
  initializeProject
} = require('../bin/agent-steward.js');

function temporaryProject(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-steward-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('init installs the skill and project governance files', (t) => {
  const project = temporaryProject(t);

  initializeProject(project);

  assert.ok(fs.existsSync(path.join(project, '.codex', 'skills', 'single-agent-project-steward', 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(project, '.agent', 'project.md')));
  assert.match(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8'), /single-agent-project-steward:start/);
  assert.match(fs.readFileSync(path.join(project, '.gitignore'), 'utf8'), /^\.agent\/cache\/$/m);
  assert.equal(doctor(project).ok, true);
});

test('init preserves existing AGENTS content and does not duplicate its managed block', (t) => {
  const project = temporaryProject(t);
  const agentsPath = path.join(project, 'AGENTS.md');
  fs.writeFileSync(agentsPath, '# Existing project rules\n\nKeep this rule.\n');

  initializeProject(project);
  initializeProject(project);

  const content = fs.readFileSync(agentsPath, 'utf8');
  assert.match(content, /Keep this rule\./);
  assert.equal(content.split(START_MARKER).length - 1, 1);
});

test('init preserves an existing project profile', (t) => {
  const project = temporaryProject(t);
  const profilePath = path.join(project, '.agent', 'project.md');
  fs.mkdirSync(path.dirname(profilePath), { recursive: true });
  fs.writeFileSync(profilePath, 'project-owned profile\n');

  initializeProject(project);

  assert.equal(fs.readFileSync(profilePath, 'utf8'), 'project-owned profile\n');
});

test('forced update creates a recoverable skill backup', (t) => {
  const project = temporaryProject(t);
  initializeProject(project);
  const installedSkill = path.join(project, '.codex', 'skills', 'single-agent-project-steward');
  fs.writeFileSync(path.join(installedSkill, 'local-marker.txt'), 'old installation');

  initializeProject(project, { force: true });

  const skillsRoot = path.dirname(installedSkill);
  const backups = fs.readdirSync(skillsRoot).filter((name) => name.startsWith('single-agent-project-steward.backup-'));
  assert.equal(backups.length, 1);
  assert.ok(fs.existsSync(path.join(skillsRoot, backups[0], 'local-marker.txt')));
  assert.ok(fs.existsSync(path.join(installedSkill, 'SKILL.md')));
});

test('dry run does not write files', (t) => {
  const project = temporaryProject(t);

  const result = initializeProject(project, { dryRun: true });

  assert.ok(result.actions.length > 0);
  assert.equal(fs.readdirSync(project).length, 0);
});
