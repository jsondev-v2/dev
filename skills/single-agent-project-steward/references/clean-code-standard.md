# Mandatory Clean-Code Standard

Apply this standard to every code change. Prefer project-specific conventions when they are stricter or more precise. A deviation is acceptable only when a rule is inapplicable or an existing project constraint requires it; record the reason in the handoff.

## 1. Preserve correctness and scope

- Understand the relevant behavior, callers, data flow, and existing tests before editing.
- Preserve public behavior unless the user requested a behavior change.
- Make the smallest coherent change. Keep unrelated refactoring, formatting churn, dependency upgrades, and generated files out of the diff.
- Never invent APIs, schemas, configuration, or acceptance criteria that repository evidence does not support.

## 2. Make intent obvious

- Use domain-specific, intention-revealing names. Avoid vague names such as `data`, `item`, `temp`, `manager`, or `helper` when a precise name is available.
- Keep functions, classes, and modules cohesive. Split a unit when it mixes distinct responsibilities or levels of abstraction; do not split solely to satisfy an arbitrary line count.
- Prefer straightforward control flow. Reduce unnecessary nesting and hidden state, but use guard clauses only when they improve readability.
- Make inputs, outputs, side effects, and dependencies explicit. Avoid new mutable global state and action-at-a-distance behavior.
- Replace unexplained literals with named domain concepts when the meaning is not already obvious.

## 3. Control duplication and abstraction

- Remove duplication when repeated code represents the same stable rule or concept.
- Do not create an abstraction for a single speculative future use. Reuse an existing abstraction only when its semantics genuinely match.
- Prefer simple composition over unnecessary inheritance, indirection, configuration, or framework machinery.

## 4. Handle failures deliberately

- Validate untrusted input at system boundaries.
- Handle errors where useful recovery or context can be added; otherwise propagate them using the project's normal mechanism.
- Never silently swallow exceptions or return misleading success values.
- Error messages must be actionable and must not expose credentials, tokens, personal data, or other secrets.
- Release resources and preserve transactional consistency on failure paths.

## 5. Keep the source honest

- Comments explain non-obvious reasons, constraints, or tradeoffs—not a plain-language repetition of the code.
- Update comments and documentation when behavior changes.
- Remove dead code, commented-out implementations, temporary debug output, unused imports, and obsolete suppressions in the touched area.
- Do not present stubs, mock behavior, `TODO` markers, disabled tests, or hard-coded temporary values as completed implementation.
- Do not weaken lint, type, security, or test rules merely to make checks pass. Any necessary suppression must be narrow and explained inline.

## 6. Verify behavior

- Add or update tests for changed observable behavior when the project has a test framework.
- Cover the main success path plus meaningful failure and boundary cases. Prefer behavior assertions over implementation-detail assertions.
- A bug fix should include a regression test when practical.
- Tests must be deterministic, isolated from uncontrolled external state, and readable enough to document the expected behavior.
- Do not delete, skip, or dilute a valid failing test to conceal a regression.

## 7. Mandatory handoff gate

Before declaring completion:

1. Review the complete diff for accidental scope expansion, secrets, generated noise, dead code, and inconsistent naming.
2. Run the project's formatter or formatting check on changed code.
3. Run relevant lint, static analysis, and type checks.
4. Run focused tests, then the broader affected suite when practical.
5. Run the build or packaging check when the change can affect it.
6. Report exactly which checks passed, failed, or were unavailable. Never claim an unrun check passed.

If the repository lacks a required tool, do not introduce a new dependency unless the user requested project tooling changes. Perform the remaining checks and report the gap.
