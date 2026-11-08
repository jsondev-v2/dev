<!-- single-agent-project-steward:start -->
## Single-agent project governance

For implementation, debugging, refactoring, security, or UI/UX work, read and follow `.codex/skills/single-agent-project-steward/SKILL.md` before substantial scanning or editing.

- Use one accountable primary agent. Do not delegate unless the user explicitly requests multi-agent work.
- Establish an edit allowlist in `.agent/cache/active-task.md`; related features are read-only until a verified dependency requires a change.
- Reuse the project profile and task cache before searching. Prefer targeted discovery and do not repeat broad scans without recording why cached evidence became insufficient.
- Apply the skill's mandatory clean-code, security, scoped-cache, and restrained UI/UX handoff gates.
- Preserve unrelated project behavior and user changes. Report checks actually run and remaining uncertainty.
<!-- single-agent-project-steward:end -->
