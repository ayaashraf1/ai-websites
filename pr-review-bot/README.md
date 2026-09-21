# AI PR Review Bot

This GitHub Actions workflow automatically requests a Copilot code review when
a non-draft pull request is opened, updated, reopened, or marked ready for
review. It also posts a checklist comment describing the review areas.

## Requirements

- A GitHub repository with GitHub Actions enabled
- GitHub Copilot code review available for the repository or organization
- Permission to add workflow files and repository instructions

## Installation

Copy the two files in this directory into the target repository using these
paths:

```text
.github/workflows/pr-review-bot.yml
.github/copilot-instructions.md
```

The workflow uses the automatically provided `GITHUB_TOKEN`; no personal token
or additional secret is required.

The workflow requests these permissions:

- `contents: read` to inspect repository contents
- `pull-requests: write` to request the reviewer

## How to use it

1. Add the files at the paths above and push them to the default branch.
2. Open or update a non-draft pull request.
3. The workflow requests `copilot-pull-request-reviewer[bot]` and adds a
   checklist comment to the pull request.
4. Copilot posts its review on the pull request when the review is ready.

Draft pull requests are ignored until they are marked ready for review.

## Customizing the review

Edit `.github/copilot-instructions.md` in the target repository. The included
instructions organize findings under Security, Logic Correctness, Test
Coverage, and Maintainability & API Contracts. Keep the instructions focused on
the behavior and risks that matter for your codebase.

## Troubleshooting

- **The workflow does not run:** confirm the file is under
  `.github/workflows/` and that Actions are enabled.
- **No Copilot review appears:** confirm Copilot code review is available and
  enabled for the repository or organization.
- **The workflow cannot update the pull request:** check that workflow
  permissions allow `pull-requests: write`.
- **The reviewer is already requested:** this is handled by the workflow and
  does not fail the job.

## Files

- `pr-review-bot.yml` - GitHub Actions workflow
- `copilot-instructions.md` - review criteria used by Copilot
