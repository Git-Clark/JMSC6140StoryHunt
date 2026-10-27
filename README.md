# Story Hunt

A 30 minute newsroom research warm up for JMSC6140, School of Future Media, The University of Hong Kong.

Students work in pairs. They pick a beat, spin a wheel for an assignment, run one identical prompt through four different search methods, compare what comes back, collect three verified sources, and write up the workflow they used. The output is copied to a class Padlet.

It is a plain static site. No build step, no framework, no dependencies.

## Files

```
index.html          the whole interface, all stages, and the icon sprite
css/styles.css      all styling
js/data.js          all content: beats, 16 topics, the prompt template, source types
js/app.js           app logic: wheel, tabs, validation, summary, copy
assets/             the original newspaper icon as supplied
```

## Running it locally

Open `index.html` in a browser. That is the whole process.

If your browser blocks local files, run a small server from this folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Changing the content

Everything students read in the game, apart from the editor dialogue, lives in `js/data.js`.

- **Topics**: edit the `TOPICS` array. Each entry needs a `beat`, a `short` label of one or two lines for the wheel, a `title`, a `promptName` (the same topic phrased to read correctly inside the prompt sentence), a `brief` in the editor's voice, and a `tension` line telling students what to compare. Keep four topics per beat, the wheel is drawn in four segments.
- **The prompt**: edit `PROMPT_TEMPLATE`. `{TOPIC}` is replaced with the assigned topic title.
- **The four search methods**: edit `METHODS`. The order in the array is the order students are told to work through.
- **Padlet link**: edit `PADLET`.
- **GNOMI link**: edit `GNOMI_URL`.

The editor's name, portrait placeholder and dialogue are in `index.html`, in the section marked `<!-- 2 desk -->`.

## Pushing to GitHub

```
cd story-hunt
git init
git add .
git commit -m "Story Hunt first draft"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/story-hunt.git
git push -u origin main
```

## Deploying on Vercel

1. Go to vercel.com and choose Add New, then Project.
2. Import the `story-hunt` repository from GitHub.
3. Framework Preset: **Other**. Leave the build command and output directory empty.
4. Deploy.

Vercel serves the folder as a static site. Every push to `main` redeploys automatically.

## Notes

- Student progress is saved in the browser's local storage so a refresh does not wipe their work. The Start over button clears it. Nothing is sent anywhere.
- The site is dark only and works down to phone width.
- No analytics, no cookies, no tracking.
