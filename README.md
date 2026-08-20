# Venture Labs AI Pulse — static site

Three self-contained HTML files, no build step, no dependencies beyond
Google Fonts (Poppins) loaded via CDN link.

- `index.html` — the main landing page + embedded AI Pulse Score quiz
- `pulse-imprint.html` — Impressum (§5 TMG)
- `pulse-privacy.html` — Datenschutzerklärung

## Publish with Claude Code

From inside this folder, open Claude Code and ask it to:

1. Run `gh auth login` (browser-based login — safe, no token typed anywhere)
2. Create a new repo in the Venture Labs GitHub organization
3. `git init`, commit these three files, and push

## Before going live

- `pulse-landing-page.html`'s script has a `BOOKING_URL` constant already
  set to the Google Meet appointment schedule link.
- The quiz's `submitEmail()` function doesn't send data anywhere yet —
  wire it to a CRM/email tool (e.g. via Netlify Forms if hosting there).
