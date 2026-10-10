# Login System with Account Types and Session Management

Implements a client-side authentication system with session persistence, account-type-based UI gating, and 8 seeded demo accounts (4 mentees, 3 mentors, 1 admin). Authentication via email and password with 6-character minimum; sessions stored in localStorage and restored on page reload. Account type gates navigation (mentors hide "Friends" tab) and user-specific form fields vary by type.

Watch for: **Critical bug—undefined variable references in search and mentors views will crash the app**. Three global variables (`MEN`, `MTR`, `PN`) are referenced but never defined. They need aliases or refactoring to use the actual data arrays.

**Verdict**: NEEDS_CHANGES

---

## High-level view

Authentication is centralized in a new `auth.js` module that manages login, registration, logout, and session lifecycle. Sessions are persisted as JSON in localStorage and restored on app init. The app routes to login if no session exists, or to the user's profile if logged in. State tracks current user ID, account type, and user object; a `getCurrUser()` helper looks up the full user from seed data by ID. Navigation is gated by account type: mentors don't see the "Friends" tab, and there's stub support for an admin "Coordinator" section. The implementation follows the existing architectural pattern—state-driven rendering, global click handlers, form input wired to state.

However, the existing view functions reference three undefined global variables (`MEN` for mentees, `MTR` for mentors, `PN` for parish names) that should be aliases to `menteesN`, `mentors`, and `ParishName`. Without these definitions, the app crashes when a user navigates to the "Find mentee friends" or "Find a mentor" screens. This is a showstopper that must be fixed before the system can be tested end-to-end.

---

<details>
<summary>Issues (1)</summary>

1. **Undefined variables in views** — Three global variable references (`MEN`, `MTR`, `PN`) are missing definitions. Line 67 in app.js uses `MEN.filter()`, line 102 in views.js uses `MTR.filter()`, and multiple views use `PN[...]` to look up parish names. They should be aliased to `menteesN`, `mentors`, and `ParishName` respectively. Will crash when user clicks "Add mentee friends" or "Get in touch with a mentor".

</details>

<details>
<summary>Details</summary>

### Session storage and initialization

Sessions are stored in localStorage under the key `"auth.session"` as a JSON object with shape `{ userId, accountType, user }`. The session object includes the user's name, email, account type, parish, age, and type-specific fields (year for mentees, years of service for mentors).

On app init, `app.js` calls `AUTH.initAuth()` to seed demo accounts on first load, then `AUTH.getSession()` to check for an active session. If a session exists, state is populated with `userId`, `accountType`, and `sessionUser`, and the app renders the profile screen. If no session exists, the app shows the login screen. This flow is correct and matches the requirements.

### Demo accounts and credential validation

Eight demo accounts are seeded: four mentees (Joanna, Grace, Marcus, Rachel), three mentors (Patricia, Joseph, Mary), and one admin. All use the password `"password123"`. Accounts are stored under a `"auth.accounts"` key in localStorage, indexed by lowercase email.

Login validates that the email exists and the password matches, returning an error message if either fails. Registration validates that the password is at least 6 characters, that the email is not already registered, and that name and account type are provided. These checks are enforced at the auth module level and toasted to the user if violated. Good pattern here.

### View routing and navigation gating

The router correctly routes based on session state: no session → login screen, session exists → profile screen. Navigation is conditional on account type: `nav(S.accountType || "mentee", activeScreen)` is passed the current account type, and mentors are filtered out of the "Friends" nav item. There's also a stub for admin showing a "Coordinator" nav item (currently a no-op).

The `profile()` view uses `getCurrUser()` to look up the user from the seed data, falling back to a hardcoded `mentees` object if the lookup fails. The fallback suggests a defensive pattern, though in normal flow `getCurrUser()` should always succeed after login.

### Critical bug: undefined variable references

Three undefined variables are referenced in views and app functions:

- **Line 67 in app.js**: `l = MEN.filter(...)` in the `res()` function filters a mentee search.
- **Line 102 in views.js**: `const l = MTR.filter(...)` in the `mentors()` view filters mentors by parish, age, skill.
- **Multiple lines in views**: `PN[m[2]]` looks up a parish name (e.g., `PN["ig"]` → `"St Ignatius"`).

The actual data arrays are defined in data.js as `menteesN`, `mentors`, and `ParishName`. These three variables (`MEN`, `MTR`, `PN`) should be aliased to them, likely at the top of data.js or in state.js where they'd be accessible to all views. Without the aliases, code that navigates to the "Find mentee friends" screen will throw `MEN is not defined` (or similar) when `res()` tries to filter, and navigating to the "Find a mentor" screen will throw an error on line 102 of views.js. This breaks two of the core user flows and is a confirmed, articulable bug.

### Login and registration forms

Login form wires email and password inputs to state (`S.loginEmail`, `S.loginPassword`) via `oninput` handlers in `app.js`'s renderer. Registration form similarly wires all inputs including account type, parish, and age dropdowns. Form state is cleared after successful login or registration. The implementation is consistent with the existing app pattern.

### Logout and session clearing

Logout button calls the `confirmLogout` action, which calls `AUTH.logout()` (removes the session from localStorage), clears state fields (`userId`, `accountType`, `sessionUser`), sets `S.scr = "login"`, and re-renders. This is correct.

### Script load order

`index.html` loads scripts in the correct order: `data.js`, `state.js`, `auth.js`, `components.js`, `views.js`, `app.js`. Auth functions are available to app.js when it initializes at the bottom of the page. ✓

### Previous hardcoded user flow

The plan specified that "the previously hardcoded user flow still works through the new auth path." The existing mentee-to-mentor interaction flow (find mentees, friends, book a session, video call, etc.) is preserved, with hardcoded demo data powering it. The profile, journey, find, friends, mentors, book, and call views all exist and use the same data structures. A logged-in mentee can navigate through these flows, subject to the MEN/MTR/PN bug.

</details>

---

**File map:**
- `js/auth.js` — New authentication module; login, register, logout, session persistence, demo account seeding.
- `js/state.js` — Added `userId`, `accountType`, `sessionUser` fields; added `getCurrUser()` helper.
- `js/views.js` — Added login, register, logout views; updated profile, mentors views to use session user.
- `js/components.js` — Updated `nav()` to accept account type and conditionally render items.
- `js/app.js` — Added session check on init, login/register/logout action handlers, form input wiring.
- `index.html` — Added auth.js script tag in correct load order.
- `js/data.js` — Added email and password fields to seed functions; seedMentees, seedMentors, seedAdmin functions.

**Full diff:** `git diff main HEAD` in catechist-site/.
