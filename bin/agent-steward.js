#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILL_NAME = 'single-agent-project-steward';
const SKILL_SOURCE = path.join(PACKAGE_ROOT, 'skills', SKILL_NAME);
const AGENTS_TEMPLATE = path.join(SKILL_SOURCE, 'assets', 'project-agents.md');
const PROFILE_TEMPLATE = path.join(SKILL_SOURCE, 'assets', 'project-profile.md');
const START_MARKER = '<!-- single-agent-project-steward:start -->';
const END_MARKER = '<!-- single-agent-project-steward:end -->';

function usage() {
  return `single-agent-project-steward

Usage:
  single-agent-project-steward init [project-path] [--force] [--dry-run]
  single-agent-project-steward update [project-path] [--dry-run]
  single-agent-project-steward doctor [project-path]
  single-agent-project-steward --version

Commands:
  init     Install the repo-scoped skill and project governance files.
  update   Back up and update the installed skill; preserve project-owned data.
  doctor   Verify the installation without changing files.

Options:
  --force    Back up an existing installed skill before replacing it.
  --dry-run  Show intended changes without writing files.
  --help     Show this help.`;
}

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes('--help') || args.includes('-h')) return { command: 'help' };
  if (args.includes('--version') || args.includes('-v')) return { command: 'version' };

  const command = args.shift() || 'help';
  const options = { command, projectPath: '.', force: false, dryRun: false };
  let projectPathSet = false;

  for (const arg of args) {
    if (arg === '--force') options.force = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else if (!projectPathSet) {
      options.projectPath = arg;
      projectPathSet = true;
    }
    else throw new Error(`Unexpected argument: ${arg}`);
  }

  if (command === 'update') options.force = true;
  return options;
}

function assertDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Project path must be an existing directory: ${directoryPath}`);
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

function writeIfChanged(filePath, content, dryRun, actions, actionLabel) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (current === content) return;
  actions.push(`${actionLabel}: ${filePath}`);
  if (dryRun) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function managedAgentsContent(existing, managedBlock) {
  const start = existing.indexOf(START_MARKER);
  const end = existing.indexOf(END_MARKER);

  if (start >= 0 || end >= 0) {
    if (start < 0 || end < start) {
      throw new Error('AGENTS.md contains an incomplete single-agent-project-steward marker block. Repair it before continuing.');
    }
    const afterEnd = end + END_MARKER.length;
    return `${existing.slice(0, start)}${managedBlock}${existing.slice(afterEnd)}`;
  }

  const separator = existing.trim().length === 0 ? '' : '\n\n';
  return `${existing.trimEnd()}${separator}${managedBlock}\n`;
}

function ensureGitIgnore(projectRoot, dryRun, actions) {
  const gitIgnorePath = path.join(projectRoot, '.gitignore');
  const requiredLines = ['.agent/cache/', '.codex/skills/*.backup-*/'];
  const existing = fs.existsSync(gitIgnorePath) ? fs.readFileSync(gitIgnorePath, 'utf8') : '';
  const existingLines = new Set(existing.split(/\r?\n/).map((line) => line.trim()));
  const missing = requiredLines.filter((line) => !existingLines.has(line));
  if (missing.length === 0) return;

  const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
  const block = `${separator}\n# Local AI task state and recoverable skill backups\n${missing.join('\n')}\n`;
  writeIfChanged(gitIgnorePath, existing + block, dryRun, actions, 'Update .gitignore');
}

function installSkill(projectRoot, force, dryRun, actions) {
  const skillsRoot = path.join(projectRoot, '.codex', 'skills');
  const destination = path.join(skillsRoot, SKILL_NAME);

  if (fs.existsSync(destination)) {
    if (!force) {
      actions.push(`Preserve existing skill (use update or --force): ${destination}`);
      return;
    }

    const backup = `${destination}.backup-${timestamp()}`;
    actions.push(`Back up existing skill: ${destination} -> ${backup}`);
    if (!dryRun) {
      fs.mkdirSync(skillsRoot, { recursive: true });
      fs.renameSync(destination, backup);
    }
  }

  actions.push(`Install repo-scoped skill: ${destination}`);
  if (!dryRun) {
    fs.mkdirSync(skillsRoot, { recursive: true });
    fs.cpSync(SKILL_SOURCE, destination, { recursive: true, errorOnExist: true });
  }
}

function initializeProject(projectPath, options = {}) {
  const projectRoot = path.resolve(projectPath || '.');
  const force = Boolean(options.force);
  const dryRun = Boolean(options.dryRun);
  const actions = [];

  assertDirectory(projectRoot);
  assertDirectory(SKILL_SOURCE);

  installSkill(projectRoot, force, dryRun, actions);

  const agentsPath = path.join(projectRoot, 'AGENTS.md');
  const existingAgents = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : '';
  const managedBlock = fs.readFileSync(AGENTS_TEMPLATE, 'utf8').trim();
  const nextAgents = managedAgentsContent(existingAgents, managedBlock);
  writeIfChanged(agentsPath, nextAgents, dryRun, actions, 'Update managed AGENTS.md block');

  const profilePath = path.join(projectRoot, '.agent', 'project.md');
  if (fs.existsSync(profilePath)) {
    actions.push(`Preserve existing project profile: ${profilePath}`);
  } else {
    const profile = fs.readFileSync(PROFILE_TEMPLATE, 'utf8');
    writeIfChanged(profilePath, profile, dryRun, actions, 'Create project profile');
  }

  ensureGitIgnore(projectRoot, dryRun, actions);

  return { projectRoot, actions, dryRun };
}

function doctor(projectPath) {
  const projectRoot = path.resolve(projectPath || '.');
  assertDirectory(projectRoot);

  const checks = [
    ['Repo-scoped SKILL.md', path.join(projectRoot, '.codex', 'skills', SKILL_NAME, 'SKILL.md')],
    ['Project profile', path.join(projectRoot, '.agent', 'project.md')],
    ['AGENTS.md', path.join(projectRoot, 'AGENTS.md')],
    ['.gitignore', path.join(projectRoot, '.gitignore')]
  ];

  const results = checks.map(([label, filePath]) => ({ label, filePath, ok: fs.existsSync(filePath) }));
  const agentsResult = results.find((result) => result.label === 'AGENTS.md');
  if (agentsResult.ok) {
    const content = fs.readFileSync(agentsResult.filePath, 'utf8');
    agentsResult.ok = content.includes(START_MARKER) && content.includes(END_MARKER);
  }

  const ignoreResult = results.find((result) => result.label === '.gitignore');
  if (ignoreResult.ok) {
    const content = fs.readFileSync(ignoreResult.filePath, 'utf8');
    ignoreResult.ok = content.split(/\r?\n/).includes('.agent/cache/');
  }

  return { projectRoot, results, ok: results.every((result) => result.ok) };
}

function main(argv = process.argv.slice(2)) {
  try {
    const options = parseArguments(argv);
    const packageJson = require(path.join(PACKAGE_ROOT, 'package.json'));

    if (options.command === 'help') {
      console.log(usage());
      return 0;
    }
    if (options.command === 'version') {
      console.log(packageJson.version);
      return 0;
    }
    if (options.command === 'doctor') {
      const report = doctor(options.projectPath);
      console.log(`Project: ${report.projectRoot}`);
      for (const result of report.results) {
        console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.label}: ${result.filePath}`);
      }
      return report.ok ? 0 : 1;
    }
    if (options.command !== 'init' && options.command !== 'update') {
      throw new Error(`Unknown command: ${options.command}\n\n${usage()}`);
    }

    const result = initializeProject(options.projectPath, options);
    console.log(`${result.dryRun ? 'Dry run for' : 'Prepared'} project: ${result.projectRoot}`);
    for (const action of result.actions) console.log(`- ${action}`);
    console.log('- Next: complete .agent/project.md using verified project facts.');
    console.log('- Restart Codex, then invoke $single-agent-project-steward once to verify discovery.');
    return 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  END_MARKER,
  START_MARKER,
  doctor,
  initializeProject,
  main,
  managedAgentsContent,
  parseArguments
};
