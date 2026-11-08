# Deploy and Synchronize the Agent Workspace

Use a private Git repository as the source of truth. This keeps the policy and skill versioned while excluding project source, task caches, and generated packages.

Official Codex guidance supports repo-scoped skills at `.codex/skills/<skill-name>/SKILL.md` and user-scoped skills at `~/.codex/skills/<skill-name>/SKILL.md`: <https://developers.openai.com/blog/eval-skills>

## 1. Review before upload

From this directory, confirm that only the governance kit will be published:

```powershell
git status --short
git check-ignore -v projects 2>$null
```

Do not upload project source, `.agent/cache`, credentials, environment files, tokens, customer data, or generated archives.

## 2. Create the private online repository

1. In GitHub, GitLab, or another Git host, create an empty **private** repository.
2. Do not initialize it with a README, license, or `.gitignore` because this directory already contains the required files.
3. Copy the repository's HTTPS or SSH URL.

## 3. Publish this workspace

Run these commands from this directory, replacing the placeholder URL:

```powershell
git init
git add AGENTS.md DEPLOY.md README.md .gitignore package.json package-lock.json bin skills test tools
git diff --cached
git commit -m "Add shared single-agent project governance"
git branch -M main
git remote add origin <YOUR-PRIVATE-REPOSITORY-URL>
git push -u origin main
```

Review `git diff --cached` carefully before committing. Authentication is handled by your Git provider; never paste a token into a tracked file or command that will be logged.

## 4. Install on the first device

Install the skill for the current user:

```powershell
.\tools\install-skill.ps1
```

This copies the skill to the current Codex user skill directory. Restart the Codex session after installation, then test explicit activation:

```text
Use $single-agent-project-steward to inspect this project without changing files.
```

## 5. Download on another device

Install Git and Codex, then clone the private repository:

```powershell
git clone <YOUR-PRIVATE-REPOSITORY-URL> dev-agent-workspace
Set-Location dev-agent-workspace
.\tools\install-skill.ps1
```

On macOS or Linux with PowerShell 7:

```bash
git clone <YOUR-PRIVATE-REPOSITORY-URL> dev-agent-workspace
cd dev-agent-workspace
pwsh ./tools/install-skill.ps1
```

Restart the Codex session and explicitly invoke the skill once to confirm discovery.

## 6. Use repo-scoped installation when needed

To make the skill available only inside a particular repository:

```powershell
.\tools\install-skill.ps1 `
  -Scope Repository `
  -RepositoryPath C:\path\to\project
```

The installer writes to `<project>/.codex/skills/single-agent-project-steward`. Commit that copy only when the project itself should carry the skill.

## 6A. Install into an old project with npx

Before npm publication, run the CLI directly from the private GitHub repository:

```powershell
Set-Location C:\path\to\old-project
npx github:OWNER/REPOSITORY init .
npx github:OWNER/REPOSITORY doctor .
```

After publishing the package to npm:

```powershell
Set-Location C:\path\to\old-project
npx single-agent-project-steward init .
```

For an existing installation:

```powershell
npx single-agent-project-steward update .
```

The CLI preserves existing project rules and profiles. It updates only its marked `AGENTS.md` block and creates a recoverable backup before replacing an installed skill.

To inspect changes without writing:

```powershell
npx single-agent-project-steward init . --dry-run
```

## 6B. Publish the npx package

The package name `single-agent-project-steward` was unregistered when this kit was prepared, but npm names are not reserved until publication.

Validate the exact package contents first:

```powershell
npm test
npm run pack:check
```

For a public package:

```powershell
npm login
npm publish --access public
```

Publishing is an external action. Review `npm pack --dry-run` output and confirm no private project files or secrets are included before running `npm publish`.

## 7. Keep devices synchronized

On the device where you update the source:

```powershell
git add AGENTS.md DEPLOY.md README.md .gitignore package.json package-lock.json bin skills test tools
git diff --cached
git commit -m "Update agent governance"
git push
```

On every other device:

```powershell
git pull --ff-only
.\tools\install-skill.ps1 -Force
```

`-Force` does not silently destroy the installed copy. It first moves the existing installation to a timestamped backup beside the installed skill.

## 8. Create a downloadable ZIP

Build the distribution package:

```powershell
.\tools\package-workspace.ps1
```

The command creates:

- `dist/single-agent-project-steward-kit.zip`
- `dist/single-agent-project-steward-kit.zip.sha256`

Upload both files to a private release or private cloud storage. On another device, verify the SHA-256 hash, extract the ZIP, and run `tools/install-skill.ps1`.

Verify on Windows:

```powershell
$expected = (Get-Content .\single-agent-project-steward-kit.zip.sha256).Split(' ')[0]
$actual = (Get-FileHash .\single-agent-project-steward-kit.zip -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Package checksum mismatch.' }
```

## 9. Organize multiple projects

Clone independent projects beneath this workspace so the root `AGENTS.md` applies to them:

```text
dev-agent-workspace/
|-- AGENTS.md
|-- skills/
|-- tools/
`-- projects/
    |-- project-a/  (separate Git repository)
    `-- project-b/  (separate Git repository)
```

The root `.gitignore` excludes `projects/`, preventing this governance repository from accidentally uploading those projects.
