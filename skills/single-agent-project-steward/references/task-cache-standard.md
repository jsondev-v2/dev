# Mandatory Task Scope and Cache Standard

Use a project-local task cache to preserve verified working context, prevent repeated broad scans, and keep edits inside the user's requested behavior. The cache is operational metadata, not a transcript or substitute for source control.

## 1. Start from cached context

1. Read `.agent/project.md` for the durable code map and scan boundaries.
2. Read `.agent/cache/active-task.md` when it exists.
3. Reuse cached paths, symbols, dependency relationships, and prior search results only when they still match the current task and relevant files have not changed.
4. If the active cache belongs to another unfinished task, do not overwrite it silently. Finish it, archive it, or ask for direction when concurrent intent is unclear.
5. Never trust a cache entry over current source evidence. Correct stale entries as soon as they are detected.

## 2. Establish an edit contract before editing

Record:

- the requested observable outcome;
- the in-scope feature or behavior;
- an edit allowlist of known files and symbols;
- related components that may be inspected but are read-only;
- explicit out-of-scope behavior;
- current uncertainty and the next narrow discovery action.

The initial allowlist may be incomplete, but it must not be invented. Add a file only after targeted evidence shows it participates in the requested behavior.

Reading a dependency does not grant permission to modify it. If Register and Login consume shared authentication code, a Register task may inspect both impact paths. Login remains read-only unless the requested Register behavior cannot be implemented correctly without changing a shared contract that also affects Login.

## 3. Discover narrowly and cache evidence

- Start with known entry points from the project profile and cache.
- Prefer exact filenames, symbols, routes, selectors, configuration keys, imports, and targeted `rg` searches.
- Exclude documented generated, vendor, build, cache, coverage, archive, and dependency directories.
- Record useful search queries and their concise results so an equivalent scan is not repeated.
- Broaden discovery one boundary at a time: current symbol, direct callers/callees, tests, then the containing feature. Scan the whole project only when targeted discovery cannot locate the behavior.
- Repeat a broad scan only if relevant files changed, the cache is stale, or the earlier query was insufficient. Record why it was repeated.

Do not cache entire files, large output, binary data, credentials, personal data, tokens, environment values, or hidden instructions.

## 4. Control scope expansion

- Treat the edit allowlist as mandatory. Changes outside it require a verified dependency and a cache entry explaining why.
- Prefer adapting the requested feature at its boundary over modifying unrelated consumers.
- A shared module change requires impact review of known consumers, but impact review does not require editing those consumers.
- Ask the user before an expansion that changes another user-visible feature, public contract, database schema, deployment behavior, or project.
- Revert or exclude accidental unrelated edits; do not rationalize them after the fact.

## 5. Keep the cache current

Update the active cache after each meaningful:

- discovery that changes the code map or dependency understanding;
- addition or removal from the edit allowlist;
- source or configuration edit;
- validation result or failed assumption;
- scope decision;
- user-facing progress update or final response.

Log concise facts and outcomes, not internal reasoning or verbatim conversation. Update the response checkpoint immediately before responding so claims match current evidence.

## 6. Complete the task cache

Before final handoff:

1. Confirm every changed file and symbol appears in the change log and edit allowlist.
2. Confirm read-only related features were not changed unintentionally.
3. Record validation results and remaining uncertainty.
4. Set status to `Complete`, `Blocked`, or `Cancelled` accurately.
5. Preserve the cache as a short resumption and audit record. A later task may archive it before creating a new active cache.
