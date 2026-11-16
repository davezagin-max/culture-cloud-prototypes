# Culture Cloud frontline recognition prototypes

Clickable prototypes for the O.C. Tanner sponsored project (IS 4496, University of Utah, Group 7).

- **Live demo:** https://davezagin-max.github.io/culture-cloud-prototypes/
- **Code:** https://github.com/davezagin-max/culture-cloud-prototypes

The demo link opens in any browser with no login. It works on a phone too.

Goal: get more Gen Z frontline workers sending meaningful recognition each month. The metric is recognition sent.

| # | Prototype | Lead | Route |
|---|-----------|------|-------|
| 1 | Video recognition | David | `#/video` |
| 2 | QR recognition cards | Sam | `#/qr` |
| 3 | Post-shift reminders | Rane | `#/reminders` |

This is a student prototype. Every person, workplace, and number in it is made up. There is no backend.

## Run it locally

You need Node 20.19 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open the address Vite prints (usually http://localhost:5183).

## Presenting

- **Home screen:** press `1`, `2` or `3` to open a prototype.
- **Inside a prototype:** `→` steps forward, `←` steps back, `R` restarts, `H` goes home.
- **Right arrow fills in the example.** On a form step the first press fills in the example answer and the second press sends it, so you can present without typing.
- **Presenter panel:** on a laptop the panel beside the phone shows the current step, the barrier, and the metric. It is hidden on small screens.
- **Real QR code:** the code on the printed card points at this site's `#/qr/form`. Once deployed, anyone can scan it with a phone and land in the flow.
- **Camera:** the video flow uses the camera only if the browser already has permission or you tap "Use my camera". Otherwise the take is simulated. Captions are scripted, not speech-to-text.

## Where to edit things

| What | File |
|------|------|
| Names, roles, copy, presenter notes, metrics | `src/data/mockData.js` |
| Colours, font, corner radius, shadows | `src/styles/tokens.css` |
| Shared components (button, card, avatar, header, confirmation) | `src/components/` |
| The three flows | `src/flows/` |
| Home screen | `src/pages/Home.jsx` |

### Design tokens are placeholders

`src/styles/tokens.css` currently uses neutral greys and the system font. It does not match Culture Cloud yet. To brand the prototypes:

1. Put screenshots of the real product in `reference/`. That folder is in `.gitignore`, so screenshots stay on your machine and are never pushed. Each teammate adds their own copy.
2. Update the values in `src/styles/tokens.css` to match them.

Every component reads from those tokens, so nothing else needs to change. The product name is shown as a plain text label. Do not add the O.C. Tanner logo unless a logo file is in `reference/`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

One-time setup:

1. Create a GitHub repository and push this folder to it.
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The site appears at `https://<your-username>.github.io/<repo-name>/`. Asset paths are relative and routing is hash-based, so it works under any repository name.

To check a production build locally:

```bash
npm run build
```

```bash
npm run preview
```

## Tech

React, Vite, Tailwind CSS v4. Hash-based routing with no router library. One extra dependency, `qrcode`, draws the code on the printed card.
