---
argument-hint: <pr-title>
---

Ship the current branch as a pull request.

Steps:

1. Run `git status` and confirm there are uncommitted changes worth shipping.
2. Stage everything sensible (skip `.env`, secrets, large binaries).
3. Create one focused commit with a conventional-commits message — title should match `$ARGUMENTS` if provided.
4. Push to the current branch (create on remote if needed).
5. Open a PR with `gh pr create`. Use `$ARGUMENTS` as the title; auto-generate a short body.
6. Print the PR URL.

Stop early if:

- The branch is `main`/`master` — refuse and ask the user to create a feature branch.
- The diff is empty — nothing to ship.
