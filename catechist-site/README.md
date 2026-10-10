# Catechist Support — front-end prototype

Static site, no build step. Open `index.html` in a browser (or serve the folder).

```
index.html        page shell; loads the files below in order
css/styles.css    colour tokens, components, desktop layout (900px+)
js/data.js        demo data (parishes, mentors, formation courses, topics)
js/state.js       app state `S` and helpers
js/components.js  avatar, header, navigation, progress
js/views.js       one function per screen
js/app.js         renderer R(), search, toasts, click handlers
build.py          bundles everything into dist/catechist-app.html
```

Script order matters: files share globals, so keep the `<script>` order in `index.html`.

## How to change things
- **Copy, topics, formation courses:** edit `js/data.js`.
- **A screen:** edit its function in `js/views.js`. Buttons use `data-a="action"`; add the action in the handler map at the bottom of `js/app.js`.
- **Colours / layout:** edit `css/styles.css` (tokens at the top, desktop rules at the bottom).
- **Backend:** `server/src/db/schema.ts` holds the planned database; `data.js` is what the API replaces.
