# Single-Agent Project Steward

Install consistent Codex project governance into an existing repository with one command.

## Install into an old project

After this package is published to npm:

```bash
npx single-agent-project-steward init .
```

From a GitHub repository before npm publication:

```bash
npx github:OWNER/REPOSITORY init .
```

The installer:

- installs the repo-scoped skill under `.codex/skills/single-agent-project-steward`;
- adds or updates only its marked block in `AGENTS.md` while preserving existing rules;
- creates `.agent/project.md` only when it does not already exist;
- excludes local task caches and installer backups through `.gitignore`;
- refuses to replace an installed skill unless `update` or `--force` is used;
- creates a timestamped, recoverable backup before an update.

## Commands

```bash
npx single-agent-project-steward init .
npx single-agent-project-steward init . --dry-run
npx single-agent-project-steward update .
npx single-agent-project-steward doctor .
```

After installation, complete `.agent/project.md` using verified project facts, restart Codex, and invoke `$single-agent-project-steward` once to confirm discovery.

See [DEPLOY.md](DEPLOY.md) for Git synchronization, packaging, and npm publication steps.
