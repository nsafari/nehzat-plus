# Arabic + English Website Rewrite Plan (Pure HTML/CSS/JavaScript)

## 1. Goal and Scope

Rewrite the current website to support two languages:

- English (`en`, left-to-right)
- Arabic (`ar`, right-to-left)

Constraints:

- Use only HTML, CSS, and vanilla JavaScript
- No framework dependency
- Keep the codebase maintainable and translation-friendly

---

## 2. Recommended Architecture

Use a **single shared HTML structure** per page and load language strings at runtime from JSON locale files.

Why this approach:

- avoids duplicated markup
- keeps layout updates in one place
- simplifies long-term translation maintenance

---

## 3. Proposed Project Structure

```text
/
  index.html
  about.html
  services.html
  contact.html
  /assets
    /css
      base.css
      layout.css
      components.css
      rtl.css
    /js
      app.js
      i18n.js
    /locales
      en.json
      ar.json
```

---

## 4. Step-by-Step Implementation Plan

## Step 1 - Content Inventory

1. List all pages and reusable sections (header, footer, cards, forms, CTAs).
2. Extract every user-facing string.
3. Assign each string a stable key (for example `home.hero.title`).
4. Prepare translation-ready files:
   - `en.json` (source language)
   - `ar.json` (Arabic translation)

Deliverable: complete translation key map with no hardcoded copy left behind.

## Step 2 - Build Core i18n Module

Create `assets/js/i18n.js` with functions to:

1. Detect current language (`URL`, `localStorage`, fallback default).
2. Load locale JSON asynchronously.
3. Replace text for elements marked with attributes such as:
   - `data-i18n="key.path"`
   - `data-i18n-placeholder="key.path"`
   - `data-i18n-aria-label="key.path"`
4. Update document metadata:
   - `<html lang="...">`
   - `document.title`
   - meta description

Deliverable: language switch updates all mapped UI strings.

## Step 3 - Add Language Switcher UX

1. Add an English/Arabic switch in header and mobile nav.
2. Persist user choice in `localStorage`.
3. Keep the user on the same page when switching language.
4. Clearly indicate the active language.

Deliverable: consistent, intuitive language toggle across pages.

## Step 4 - Implement RTL/LTR Direction Handling

When Arabic is active:

- set `<html dir="rtl" lang="ar">`

When English is active:

- set `<html dir="ltr" lang="en">`

CSS tasks:

1. Refactor directional styles to logical properties where possible:
   - `margin-inline-start/end`
   - `padding-inline-start/end`
   - `text-align: start/end`
2. Keep `rtl.css` only for unavoidable exceptions.

Deliverable: correct visual layout in both directions with minimal CSS duplication.

## Step 5 - Convert Page Templates

For each page:

1. Replace hardcoded text with `data-i18n` attributes.
2. Ensure all buttons, labels, placeholders, and messages are localized.
3. Validate that dynamic JS-generated text also uses translation keys.

Deliverable: all pages render correctly in both languages.

## Step 6 - Typography and Readability Enhancements

1. Add Arabic-friendly font fallback stack.
2. Tune line-height and spacing for Arabic script.
3. Validate mixed content rendering (Arabic + English numbers/symbols).

Deliverable: readable and visually balanced typography in both locales.

## Step 7 - SEO and Metadata Localization

1. Localize page title and description per language.
2. Add `hreflang` links for Arabic and English variants.
3. Define canonical URLs based on chosen language URL strategy.

Language URL strategy options:

- Query parameter style (`?lang=en`, `?lang=ar`) - simpler implementation
- Path style (`/en/...`, `/ar/...`) - stronger SEO structure

Deliverable: search engines can identify and index both language versions.

## Step 8 - QA and Validation

Run a full QA pass for both languages:

1. Desktop and mobile responsiveness
2. RTL alignment and component mirroring
3. Form labels, validation text, and placeholders
4. Menu behavior and active state
5. Accessibility checks (`lang`, focus order, ARIA labels)
6. Cross-browser compatibility

Deliverable: bilingual release candidate with no missing translations or layout regressions.

## Step 9 - Content and Maintenance Workflow

1. Define a key naming convention for locale files.
2. Document how to add new translatable text.
3. Require locale updates for every new user-facing string.
4. Add a pre-release checklist item: "translation parity verified."

Deliverable: sustainable process for future updates.

---

## 5. Implementation Milestones

1. Foundation: i18n module + locale files + language toggle
2. Layout: RTL/LTR styling and component compatibility
3. Migration: all pages converted to translation keys
4. SEO/accessibility: localized metadata and language tagging
5. QA/polish: final bilingual verification

---

## 6. Risks and Mitigations

- Risk: missing translation keys  
  Mitigation: log missing keys in console and fallback to English

- Risk: broken RTL alignment in legacy CSS  
  Mitigation: move to logical properties and isolate exceptions in `rtl.css`

- Risk: metadata not translated  
  Mitigation: include title/meta in locale files and test page-by-page

---

## 7. Immediate Next Actions

1. Confirm language URL strategy (`?lang=` vs `/en/` and `/ar/`)
2. Create initial `en.json` and `ar.json`
3. Implement `i18n.js` and convert header/footer first
4. Roll out conversion page-by-page
