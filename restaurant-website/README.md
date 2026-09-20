# Italiano

A contemporary Italian restaurant website for **Italiano**, a fictional dining destination established in 1994. The site combines editorial typography, warm restaurant photography, and a dark rust-and-gold visual direction inspired by classic Italian hospitality.

## Pages

- Home page with the restaurant story, signature dishes, guest quote, and reservation call to action
- Menu page with antipasti, handmade pasta, and secondi
- About page with the restaurant history and team
- Responsive navigation and footer across every page

## Stack

- Next.js 15
- React 19
- Plain CSS

## Run locally

From this directory:

```bash
pnpm install
pnpm dev
```

Then open the local URL shown in the terminal.

## Available scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create a production build
pnpm start    # Serve the production build
pnpm lint     # Run the linter
```

## Project structure

```text
app/            App routes and layout
components/     Shared navigation and footer components
styles.css      Global styles and responsive layout rules
prompts/        Prompt used to create the website
```

Food and restaurant imagery is loaded from Unsplash through CSS background images.
