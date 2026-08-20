# Venture Labs AI Pulse — static site (Netlify-ready)

Three self-contained HTML files, no build step. `index.html` includes a
hidden static form so Netlify Forms auto-detects the AI Pulse Score quiz's
lead capture (email + company + score) at deploy time — see "After deploying"
below to finish wiring it up.

- `index.html` — the landing page + embedded AI Pulse Score quiz
- `pulse-imprint.html` — Impressum (§5 TMG)
- `pulse-privacy.html` — Datenschutzerklärung (now also discloses Netlify
  as hosting/forms processor — EU-U.S. Data Privacy Framework + SCCs)

## Deploy to Netlify

1. Go to app.netlify.com and log in (or create a free account).
2. "Add new site" -> "Deploy manually" -> drag this whole folder in.
   (Or: "Import an existing project" -> connect GitHub -> pick the repo
   already on GitHub -> leave build command empty, publish directory `/`.)
3. Netlify assigns a random `something.netlify.app` URL immediately — the
   site is live at that point.

## After deploying — finish the lead capture

1. In the Netlify dashboard: Site settings -> Forms. You should see a form
   named `pulse-score-leads` listed (Netlify only detects it after the
   first deploy).
2. Site settings -> Forms -> Form notifications -> Add notification ->
   Email notification -> enter your inbox. You'll now get an email every
   time someone finishes the quiz and submits their email.
3. Submissions (email, company, score, band, weakest dimensions, language)
   are also visible anytime under Site -> Forms -> pulse-score-leads.

## Custom domain

Site settings -> Domain management -> Add a domain, then point a CNAME
(or the subdomain your DNS provider needs) at the `netlify.app` address
Netlify gives you.

## Still open

- `BOOKING_URL` in index.html's script is already set to the Google Meet
  appointment schedule link.
- Trademark clearance for "Venture Labs AI Pulse" is intentionally deferred.
