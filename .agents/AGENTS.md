# CaseThread Custom Rules

## Git & Committing Workflow

- **One-by-One Commits**: Always add, commit, and push changes file-by-file or in small incremental steps rather than staging and committing everything at once. This keeps the commit history highly granular and active.
- **Direct Pushes**: Push commits directly to the `main` branch. Do not create feature branches, do not open Pull Requests, and do not make the user merge branches. 
- **End of Day Process**: When a day's work is completed, ask the user for permission. Once finished and approved, automatically execute the one-by-one add/commit/push process directly to the `main` branch.
