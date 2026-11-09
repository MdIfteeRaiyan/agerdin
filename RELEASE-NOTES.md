# Release notes

## Current preview update

- Split the document, styles, language data, catalog data, and shared UI into named files under `dist/`.
- Moved Bangla and English interface dictionaries, game-intro text, and the 128-entry catalog into JSON files.
- Added one ES-module entry point per playable game. Each entry is dynamically imported when its matching game opens; the existing shared runtime retains the game state, animations, and controls.
- Kept the loading-screen pixel animation, game transitions, and end-of-game scenes.
- Replaced the old star seal with one original open-notebook-and-kite SVG used for the favicon, site header, and loading screen.
- Removed the external Google Fonts dependency and stored four local font weights. The current families are Noto Bengali substitutes because the requested Hind Siliguri and Literata binaries could not be fetched in this environment.
- Added descriptive alt text, lazy loading, and async decoding to dynamically generated photo images.
- Added a paper page-turn between sections, a pencil-trace loader, staggered fade-up reveals, springy card feedback, and a kite drift that pauses when the tab is hidden.
- Added an accessible ৩–২–১ countdown before a round, 40-piece paper confetti, loss shake, score count-up, and shareable 1200 × 630 score cards.
- Added one sound toggle (off by default) for generated Web Audio cues and the existing 8-bit music, plus supported Android haptics and gamepad controls.
- Added a PWA manifest, matching install icons, and a service worker that caches the local app shell, fonts, JSON, artwork, and game modules for offline use.
- Updated the README and credits to describe the no-build static project layout.

## Existing setup item

The FormSubmit alias remains account-specific. Replace `AGERDIN_FORM_SUBMIT_ALIAS` in `dist/index.html` with the generated, confirmed alias before enabling memory submissions.

## Image repair
- Fixed the playable-game thumbnail sprite URL after the stylesheet moved into `/css/`; all nine card images load from the existing full-resolution 1500×846 sprite sheet.
- Bumped the offline cache version so installed copies fetch the repaired stylesheet.
- Reconnected the 99 distinct Wikimedia Commons photographs to the 99 non-playable folk-game archive cards; archive cards no longer use repeated category illustrations.
- Added real photo captions and descriptive alt text to the cards, plus photographer, license, and original file links in each entry.
- Filled all previously undescribed folk-game entries. Documented rules are summarized; names without dependable written rules are explicitly marked as locally variable or under-documented.
- Bumped the service-worker cache to v82 so returning visitors receive the restored photos and copy.

## Game readability, controls, and sound
- Fixed the game intro lookup to use each game ID; all nine playable games now show their localized title, description, and start label instead of `undefined`.
- Kept the three difficulty levels visible on the game intro; added Easy/Hard/Hardest to Snake and connected each level to its speed.
- Removed continuous 8-bit background music. Optional, louder sound effects are limited to game actions and remain off by default.
- Raised contrast for Snake instructions, the difficulty control, and controls against the charcoal cabinet; strengthened the archive browse and random-game button contrast.
- Verified all nine playable game copy entries in Bangla and English, retained 119 archive records and all 99 field-photo records.


## Archive images and stable startup
- Removed the delayed fallback switch that caused the page to flash and replaced archive photos with illustrations.
- Made the self-contained renderer the only startup path so the game, shop, and archive views render once without waiting for a separate module/data request.
- Connected all 99 archive entries with assigned Commons photos, descriptive alt text, and an illustrated fallback only when a source image is unavailable.
- Bumped the offline cache to v86 and removed unused module/data fetches from the active cache list.
