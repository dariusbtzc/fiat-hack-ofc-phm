# Catechist Support — front-end prototype

Static site, no build step. Open `index.html` in a browser (or serve the folder).

```
index.html        page shell; loads the files below in order
css/styles.css    colour tokens, components, desktop layout (900px+)
js/data.js        demo data (parishes, mentee/mentor directories, demo logins, formation courses, topics)
js/state.js       app state `appState` and helpers (current user, friends, booking slots)
js/auth.js        `AUTH`: login, register, logout, session (demo accounts kept in localStorage)
js/components.js  avatar, header, navigation, progress
js/views.js       `screenViews`: one function per screen
js/app.js         renderer renderApp(), search, toasts, click handlers
build.py          bundles everything into dist/catechist-app.html
```

Script order matters: files share globals, so keep the `<script>` order in `index.html`.
After changing any file, run `python3 build.py` so `dist/catechist-app.html` stays in sync.

Demo logins: `joanna.tan@example.com`, `grace.ong@example.com`, `joseph.tan@example.com`, `admin@example.com` (password `password123`).
Demo accounts are seeded into localStorage the first time the page loads; clear site data to re-seed after changing them.

## How to change things
- **Copy, topics, formation courses, demo people:** edit `js/data.js`.
- **A screen:** edit its function in `js/views.js`. Buttons use `data-a="action"`; add the action in the handler map at the bottom of `js/app.js`.
- **Colours / layout:** edit `css/styles.css` (tokens at the top, desktop rules at the bottom).
- **Backend:** not built yet; `data.js` and `auth.js` are what the API would replace.
