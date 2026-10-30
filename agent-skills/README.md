# Agent Skills Demos

Examples of GitHub Copilot agent skills and repository-level instructions for
VS Code. The skills in this repository demonstrate simple responses, scripts,
templates, code reviews, and MCP server scaffolding workflows.

## Skills

| Skill | Use it when you want to... |
|---|---|
| [`hello-galaxy`](.github/skills/hello-galaxy/SKILL.md) | Respond to `hello galaxy`, run a system-information script, and display an ASCII-art greeting. |
| [`react-component-generator`](.github/skills/react-component-generator/SKILL.md) | Scaffold a typed React component from a name and prop list, with a matching Vitest unit test. |
| [`typescript-mcp-server-generator`](.github/skills/typescript-mcp-server-generator/SKILL.md) | Build or scaffold a complete TypeScript MCP server with tools and configuration. |
| [`pr-review`](.github/skills/pr-review/SKILL.md) | Review committed changes for bugs, security issues, testing gaps, and other production risks. |

## Repository structure

```text
agent-skills-demos/
├── README.md
├── package.json             # React + TypeScript + Vitest workspace
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── setupTests.ts
│   └── components/          # Components created by react-component-generator
├── WeatherService/          # Generated MCP server demo
├── .github/
│   ├── copilot-instructions.md
│   └── skills/
│       ├── hello-galaxy/
│       │   ├── scripts/
│       │   ├── templates/
│       │   └── SKILL.md
│       ├── pr-review/
│       ├── react-component-generator/
│       │   ├── references/
│       │   ├── templates/
│       │   └── SKILL.md
│       └── typescript-mcp-server-generator/
└── .gitignore
```

## Running the React workspace

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest run
```

## How skills work

Each skill is a directory containing a `SKILL.md` file. The file includes YAML
frontmatter with:

- `name`: the skill identifier.
- `description`: the conditions that tell Copilot when to load the skill.

The rest of `SKILL.md` describes the workflow Copilot should follow. A skill
can also include supporting files such as:

- `scripts/`: executable helpers, such as the system-information script used
  by `hello-galaxy`.
- `templates/`: reusable response or code templates.
- `references/`: supporting documentation loaded only when the workflow
  needs it.

Skills are loaded from `.github/skills/`. Repository-wide behavior is documented
in [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Creating a skill

1. Create a directory under `.github/skills/`.
2. Add a `SKILL.md` with `name` and `description` frontmatter.
3. Describe the skill's trigger and step-by-step workflow.
4. Add scripts or templates only when the workflow needs them.
5. Test the skill with a request that matches its description and with a
   nearby request that should not trigger it.
