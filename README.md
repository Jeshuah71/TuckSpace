# Tuckspace

Make every space count. Tuckspace is a 2D packing optimizer that arranges a set of
rectangular boxes into a fixed-size container, built with React, TypeScript, and Vite.

## Features

- **Packing algorithm** — places boxes left-to-right, row by row, skipping any that
  don't fit (`src/packing.ts`).
- **Optimization heuristics** — tries the original order plus sort-by-area and
  sort-by-width strategies, and keeps whichever packs the most area.
- **Custom boxes** — add your own boxes by name, width, and height, with validation
  for missing names, invalid dimensions, and boxes too large for the container.
- **Visualization** — each box gets a distinct color (consistent across re-optimizes)
  so the packed layout is easy to read at a glance.
- **Stats & feedback** — container/used area, space utilization with a progress bar,
  and a clear list of any boxes that didn't fit (with the reason why).
- **Remove boxes** — drop individual boxes from the list at any time.
- **Reset** — restore the original demo boxes and form at any time.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173) in your browser.

## Scripts

| Command           | Description                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with hot reload      |
| `npm run build`    | Type-check with `tsc -b` and build for production |
| `npm run preview`  | Preview the production build locally           |
| `npm run lint`     | Run ESLint over the project                    |

## Project structure

```
src/
  packing.ts   # Types, container/items data, packing + optimization algorithms
  App.tsx      # UI: box form, canvas, box lists, stats
  App.css      # App-specific styles (petroleum-blue palette)
  index.css    # Global/base styles
  main.tsx     # React entry point
```

## Tech stack

React 19, TypeScript, Vite, and plain CSS — no backend, database, or UI framework.
