# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A mobile-first restaurant menu web app for **Didoo's Evergreen Café**. It runs entirely in the browser — no build step, no framework, no bundler. Pages are plain HTML files served statically.

## Running the app

```
npx serve .
```

The `.claude/launch.json` config points to port 3456. The app starts at `welcome.html` (index.html just redirects there).

## Page flow

```
welcome.html
  → pages/wifi-connect.html
  → pages/house-guidelines.html
  → pages/guest-details.html
  → pages/main-menu.html          ← category picker
      → pages/main-indian.html?category=<name>   ← dish list (data-driven)
          → pages/ar-experience.html?glb=…&name=…&category=…   ← AR viewer
```

Navigation between pages uses `navigateTo(href)` / `navigateBack(href)` from `js/navigation.js`, which animate `.shell` before changing `window.location.href`.

## Menu data

All dish data lives in `assets/menu.json`. Structure:

```
{
  "<category>": {
    "<subcategory>": [ { id, name, price, veg, dietary, available, spice_level, description, glb, usdz } ]
  }
}
```

`main-indian.html` reads `?category=` from the URL, fetches `menu.json`, and renders tabs (subcategories) + food-item rows entirely in JS. The `glb` / `usdz` fields on a dish are passed as query params to `ar-experience.html`, which loads them into `<model-viewer>`.

## AR experience

`pages/ar-experience.html` uses Google's [`<model-viewer>`](https://modelviewer.dev/) web component (loaded from CDN) to render `.glb` models and hand off to native AR on iOS (Quick Look / `.usdz`) and Android (Scene Viewer / WebXR). Per-dish models live in `assets/models/`. The long-term plan is to replace this with 8th Wall SLAM (see TODO comment in `ar-experience.html`).

## CSS architecture

All CSS custom properties (design tokens) are declared in `css/tokens.css` — always use these variables, never hardcode colours or spacing. Token naming: `--ev-*` for colours/surfaces, `--sp*` for spacing, `--ev-radius-*` for border radii.

CSS is split by concern:
- `css/base.css` + `css/layout.css` — global resets and the `.shell` layout
- `css/components.css` — shared components
- `css/pages/<page>.css` — page-specific styles

## Key design constraints

- Fixed 390 px wide shell (iPhone frame). The layout is not fluid/responsive — it is designed for a kiosk/tablet in portrait.
- Every page wraps content in `<div class="shell">` with `.safe-top` / `.safe-bottom` spacers for notch/home-indicator clearance.
- Dietary types: `veg`, `nonveg`, `vegan` — used as CSS class suffixes and `dietary` field values.
- Prices are in Indian Rupees (₹), stored as integers in `menu.json`.
