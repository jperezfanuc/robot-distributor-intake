# Distributor readiness intake

A static intake form for onboarding new robot distributors. Each person enters their contact details,
chooses **Sales-focused** or **Technical-focused**, and fills out the matching scorecard:

- **RSRL** (Robot Sales Readiness Level) for sales people
- **RTRL** (Robot Technical Readiness Level) for technical people

The form calculates a level from 1 to 9 and saves it, along with every raw answer, in each submission.

No build step, no dependencies. Netlify Forms collects the submissions.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page and every form field. Question weights are `data-weight` attributes. |
| `styles.css` | CRX green and charcoal styling. Colors are variables at the top of the file. |
| `config.js` | Level labels and the switch that shows or hides the result for the respondent. |
| `app.js` | Role toggle, progress bar, scoring, and the Netlify submit. |
| `netlify.toml` | Tells Netlify to publish the folder as is. |

## Deploy

1. Create a new GitHub repository and upload everything in this folder to its root.
2. In Netlify, choose **Add new site**, then **Import an existing project**, and pick the repository.
3. Leave the build command empty and set the publish directory to `.` (the `netlify.toml` already does this).
4. Deploy. Netlify detects the form on the first deploy.
5. Open **Forms** in the Netlify dashboard to see submissions. Under **Forms**, then **Form notifications**, you can add an email alert for each new one.

## Scoring

Each question has a weight. Scores are points earned divided by points available, mapped to levels 1 to 9.

- Yes/No questions: **Yes** earns the full weight, **No** earns 0.
- Range questions (0 to 5, 6 to 10, Over 10): earn 0, half, or the full weight.

Current weights (edit `data-weight` in `index.html`):

| Scorecard | Question | Weight |
| --- | --- | --- |
| RSRL | Can audit a manufacturing line | 2 |
| RSRL | Robots sold in career | 3 |
| RSRL | Robot systems sold in career | 3 |
| RSRL | Current open robotic opportunities | 2 |
| RTRL | Offline simulation, reach study, cycle time | 2 |
| RTRL | Machine vision experience | 2 |
| RTRL | Has programmed a robot | 2 |
| RTRL | Has deployed an automated system | 2 |
| RTRL | Number of robots and systems deployed | 3 |

Level labels (for example "Ready to sell robots") are in `config.js`.

Each submission includes `readiness_type`, `readiness_points`, `readiness_max`, `readiness_percent`,
`readiness_level` and `readiness_label`, plus every raw answer. The score is calculated in the browser,
so if you ever need it to be tamper-proof, recalculate it from the raw answers on your side.

## Changing questions

Copy an existing `.q` block in `index.html`, change the text and the input `name`, and set `data-type`
(`yesno` or `band`) and `data-weight`. Keep every field in the HTML, not created by JavaScript, so Netlify
can detect it at deploy time. After adding or renaming fields, redeploy.

## Preview locally

```
python3 -m http.server 8000
```

Open http://localhost:8000. Netlify Forms does not run locally, so submitting shows the thank-you page and
logs the payload in the browser console. Real submissions only work on the deployed Netlify site.

## Branding

The colors follow the FANUC CRX site (CRX green `#86BD40`). The header uses a simple placeholder mark,
not the FANUC logo. Add official logos only if you have permission to use them.
