# FolioNilo

Portfolio website for Wan Orlin Balqis, an Information Systems student at UiTM Kedah. It is a static site: plain HTML, CSS and JavaScript with no build step. All the content lives in JSON files, so you can add a project, event or certificate without touching the code.

## Preview locally

The page loads its content from `data/*.json`, and browsers block that when you open `index.html` straight from disk (a `file://` address). Run a small local server from the project folder instead:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Press `Ctrl+C` in the terminal to stop the server.

## Project layout

```
index.html              Page structure and the fixed text (hero, about, contact)
css/style.css           All styles; colours and sizes are defined at the top
js/theme.js             Applies the saved light or dark theme before the page draws
js/main.js              Builds the sections from the JSON and runs the pop-ups, menu and theme switch
data/profile.json       Hero stats, about pillars, skills, roles
data/projects.json      Projects
data/events.json        Programmes and events
data/certificates.json  Awards and certificates
images/profile/         Portrait
images/projects/        Project covers and gallery pictures
images/events/          Event photos
images/certificates/    Certificate scans
```

## Edit the content

Edit the JSON file for the section you want to change, save it, and refresh the browser. JSON is strict: keep the double quotes, and put a comma between items but not after the last one.

### Add a project

Add an object to `data/projects.json` and put its pictures in `images/projects/`. Image fields hold the file name only; the site adds the folder.

```json
{
  "title": "SmartJog AI",
  "course": "ISP624 · Team Solara",
  "role": "ISP624 · Group project (Team Solara)",
  "date": "Oct 2026",
  "summary": "One or two sentences shown on the card.",
  "points": ["Shown as the bullet list in the pop-up"],
  "tech": ["ESP32", "Firebase", "Flutter"],
  "links": [{ "label": "View project", "url": "https://example.com" }],
  "cover": "smartjog-cover.jpg",
  "images": ["smartjog-1.jpg", "smartjog-2.jpg", "smartjog-3.jpg"]
}
```

- `course` is the short label on the card; `role` is the longer label in the pop-up.
- Add `"featured": true` to one project to show it as the large card at the top. Without it, the first project is featured.
- Leave `links` as `[]` when there is nothing to link to.
- The hero's project count updates by itself.

### Add an event

Add an object to `data/events.json` with `title`, `role`, `date`, `category`, `points` and `images`. Put the photos in `images/events/`. The `category` (for example `Facilitator` or `Multimedia`) is the small label on the left of each row.

### Add a certificate

Add an object to `data/certificates.json` with `date`, `title`, `issuer` and `image`, and put the scan in `images/certificates/`. Clicking the row opens the image full size.

### Stats, pillars, skills and roles

These are in `data/profile.json`.

- `stats`: the four numbers under the hero. A value of `"auto:projects"` shows the number of projects.
- `pillars` and `skills`: each has an `icon`, which is a Font Awesome class such as `"fa-solid fa-code"`. Pick any icon from the [Font Awesome Free set](https://fontawesome.com/search?ic=free) and copy its class.
- A skill group with `"wide": true` (Strengths) spans the full width below the tool cards.
- `roles`: the list under Experience.

Text that is not in a list, such as the hero tagline, the About paragraphs and the contact email, is in `index.html`.

## Change the look

Colours, corner radii and spacing are CSS variables at the top of `css/style.css`. The `:root` block sets the light theme and `[data-theme="dark"]` sets the dark one. Change a value there and every section that uses it follows.

## Deploy

The site is static, so any static host works, GitHub Pages included. Publish the repository root; there is nothing to build.

## Credits

- Icons: [Font Awesome Free](https://fontawesome.com/license/free) 6.5.2, loaded from cdnjs. Icons are CC BY 4.0, fonts SIL OFL 1.1, code MIT. The attribution is kept in the stylesheet header served by the CDN.
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) and [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) from Google Fonts, both SIL OFL 1.1.
