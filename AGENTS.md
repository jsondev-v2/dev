# Shared Development Workspace

These instructions apply to every project below this `dev` directory.

## Ownership model

- Use one primary agent for each user task. Do not spawn, delegate to, or coordinate with sub-agents unless the user explicitly requests multi-agent work.
- Keep each task inside one identified project. Touch another project only when the user explicitly includes it or a verified dependency requires it.
- The primary agent owns discovery, implementation, validation, and the final handoff; it must not hide responsibility behind generated output or unverified claims.

## Before changing a project

- Identify the project root from repository and build markers before editing.
- Read the closest project instructions, `.agent/project.md`, and `.agent/cache/active-task.md` when present.
- If the target project is ambiguous and choosing incorrectly would cause edits in the wrong place, ask one concise question.
- Preserve existing user changes and avoid unrelated cleanup.

## Working standard

- Base decisions on inspected files and command output. Never claim a check passed unless it ran successfully.
- Make the smallest coherent change that satisfies the request.
- Use the project's documented commands. Validate in proportion to risk and report anything that could not be checked.
- Do not expose secrets, invent requirements, deploy, publish, delete data, or change external systems without clear authorization.
- Keep durable project-specific facts in that project's `.agent/project.md`; keep this root policy generic.

## Mandatory clean code

- Follow the project's established language, architecture, formatter, linter, and naming conventions unless the task explicitly changes them.
- Write code for the next human reader: use intention-revealing names, cohesive units, explicit dependencies, and straightforward control flow.
- Do not add unexplained duplication, speculative abstractions, dead code, commented-out code, debug output, silent error handling, or placeholders presented as complete work.
- Keep behavior changes covered by appropriate tests when the project has a test framework. Include important success, failure, and boundary cases.
- Before handoff, review the diff and run every relevant available formatter, static check, test, and build command. Report skipped or failing checks and the reason.
- Limit cleanup to code touched by the task. Do not turn a focused request into an unrelated refactor.

## Mandatory security

- Treat all external input, files, network responses, model output, and client-side claims as untrusted until validated at the correct boundary.
- Never hard-code, print, commit, or place secrets or real sensitive data in source, tests, fixtures, logs, prompts, or project profiles.
- Enforce authentication and authorization on the trusted server side for every protected action and resource. Default to deny and grant only the minimum required access.
- Use parameterized interfaces and context-appropriate encoding. Do not construct executable code, shell commands, queries, paths, or markup by concatenating untrusted input.
- Use established cryptographic and security libraries. Do not invent encryption, hashing, token, session, or password-storage schemes.
- Do not weaken validation, authorization, TLS verification, security headers, dependency controls, scanning, or tests merely to make a task pass.
- For security-relevant changes, test realistic misuse and failure cases, run available security checks, and report remaining risks or unavailable checks.
- Stop and request direction before exposing data, expanding privileges, disabling a security control, or performing active exploitation beyond clearly authorized local validation.

## Mandatory task scope and cache

- Create or refresh `.agent/cache/active-task.md` before the first substantial scan or edit for every implementation task.
- Log concise working state, not verbatim conversations: requested outcome, in-scope feature, allowed files/symbols, out-of-scope areas, discovered dependencies, searches already performed, edits, validation, and the next step.
- Update the task cache after meaningful discovery, scope change, edit, or validation and before each user-facing progress or final response. Never place secrets, sensitive data, or full command output in it.
- Search narrowly: consult the project profile and active cache first, inspect known entry points second, and use targeted `rg` queries before any broader project scan.
- Reuse cached file and symbol locations while they remain valid. Do not repeat an equivalent broad scan unless files changed, cached evidence is stale, or the prior search was insufficient; record the reason.
- Treat the task's file/symbol list as an edit allowlist. Related components may be inspected, but they remain read-only unless changing them is necessary for the requested behavior.
- Before editing outside the allowlist, record the dependency and reason in the cache. If this materially expands user-visible scope, ask the user first.
- A shared dependency does not make every consuming feature editable. Validate affected consumers without modifying them unless their behavior must change.

## Mandatory UI/UX design discipline

- Apply the project's existing design system, tokens, components, typography, spacing, and interaction patterns before creating new ones.
- Default to restrained color: neutral surfaces, one established primary accent, and semantic colors only for status or feedback. Do not introduce rainbow palettes, arbitrary colorful sections, decorative gradients, glows, or neon effects unless the brand system or user explicitly requires them.
- Avoid recognizable AI-design slop: excessive rounded cards, pills everywhere, oversized hero text, floating glass panels, repetitive icon-and-copy grids, unnecessary dashboards, fake metrics, generic slogans, and decoration without product meaning.
- Build hierarchy with layout, typography, spacing, alignment, and content priority before adding color, borders, shadows, or animation.
- Do not wrap every section in a card. Use containers only when they communicate grouping, interaction, or elevation.
- Keep redesign scope explicit. Changing one screen or component does not authorize restyling shared navigation, unrelated pages, or the global theme.
- Cover responsive behavior and all relevant loading, empty, error, success, disabled, focus, hover, and validation states.
- Meet accessibility requirements: semantic structure, keyboard operation, visible focus, labels, adequate contrast, readable type, and non-color status cues.
- Use real project content when available. Do not invent testimonials, metrics, customers, claims, or product capabilities.
- Before handoff, inspect the implemented UI at relevant viewport sizes and report what was and was not visually verified.

The reusable skill for onboarding and managing projects under this policy is at `skills/single-agent-project-steward/SKILL.md`. Its mandatory gates are defined in the skill's `references` directory.
