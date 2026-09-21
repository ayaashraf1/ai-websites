# Copilot Code Review Instructions

Apply these rules to every pull request review, regardless of language or
framework. Structure your review comment under these four headings, in this
order. Skip a heading only if there is truly nothing to say under it — don't
pad with generic praise.

## 🔒 Security
- Flag injection risks (SQL, command, template, XSS/HTML injection in SSR
  output, unsafe `dangerouslySetInnerHTML` / `v-html` / equivalents).
- Flag hardcoded secrets, tokens, or credentials.
- Flag unsafe deserialization, unsanitized user input reaching a sink
  (DB query, shell exec, `eval`, file path), and unsafe use of `eval`/`Function`.
- Flag missing authn/authz checks on new routes, API handlers, or server
  actions, especially in SSR/edge functions where request context is easy
  to trust incorrectly.
- Flag dependencies added with known CVEs if visible from the diff/lockfile.

## 🧠 Logic Correctness
- Trace new/changed conditionals and loops for off-by-one errors, incorrect
  boundary conditions, and unhandled `null`/`undefined`/`NaN` cases.
- Flag race conditions and unsafe shared state — especially async code,
  concurrent requests, or SSR code that can leak state between requests.
- Flag mismatched types, unchecked type coercion, and swallowed errors
  (empty catch blocks, promises without `.catch`/`await` handling).
- Flag any change to a function's inputs/outputs that isn't reflected
  everywhere it's called.

## 🧪 Test Coverage
- Flag new logic (branches, error paths, edge cases) with no corresponding
  test.
- Flag modified logic where existing tests weren't updated and no longer
  reflect the new behavior.
- Flag missing tests for previously-untested failure modes introduced by
  this change (network failure, empty state, malformed input).
- Do not require tests for pure refactors, config, or docs-only changes.

## 🛠️ Maintainability & API Contracts
- Flag breaking changes to public function signatures, exported types,
  REST/GraphQL contracts, or component props without a clear migration
  note.
- Flag significant duplication that could reuse existing code.
- Flag unclear naming, deeply nested logic, or functions doing more than
  one thing where it hurts readability.
- Flag inconsistent patterns vs. the rest of the codebase (e.g. mixing
  state-management approaches, ad hoc fetch calls instead of the existing
  data layer).

## General rules
- Prioritize **signal over volume**: 3 real issues beat 15 nitpicks.
- Every comment must state *why* it matters (impact), not just *what* to
  change.
- Where possible, suggest a concrete fix, not just a description of the
  problem.
- Do not flag style issues already enforced by the repo's linter/formatter
  config.
- If the PR is a pure dependency bump, docs change, or generated file,
  keep the review to one line confirming that.
