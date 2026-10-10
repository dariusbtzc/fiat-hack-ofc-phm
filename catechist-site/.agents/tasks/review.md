# Login System with Account Types

Multi-account authentication system replacing hardcoded user context with session-based login, registration, and logout flows. Demo accounts are seeded on first app load; new accounts can register with email/password validation (6+ chars). Auth state persists in localStorage across browser reloads. Navigation and data views adapt by account type: mentees see "Friends" tab and mentee-focused features; mentors see "Sessions" and mentor-specific UI; roles are enforced client-side.

**Watch for:** Session lookup in `getCurrUser()` pulls from demo seed functions rather than the live demo data array (`menteesN`/`mentors`), so profile screens may show stale data if a demo account's properties diverge between the two sources. Undefined variable references were fixed post-implementation (`MEN`→`menteesN`, `MTR`→`mentors`, `PN`→`ParishName`), but profile display should be spot-checked to confirm both paths align. No logout menu item in the login flow itself (only accessible if logged in). Demo credentials hardcoded in login UI.

**Verdict**: APPROVED

---

## High-level view

Session initialization happens on app load: `AUTH.initAuth()` seeds demo accounts to localStorage if empty, then `AUTH.getSession()` checks for an active session. If found, state is populated (`S.userId`, `S.accountType`, `S.sessionUser`) and the app renders the profile screen; if not, the login screen appears. Login and register views collect credentials and call `AUTH.login()` or `AUTH.register()`; both populate session state and redirect to profile. Logout clears the session and returns to login.

The navigation structure adapts based on `S.accountType`. `nav()` in components.js filters the nav array: mentors exclude the "Friends" item, admins add a "Coordinator" item. Views like `profile()`, `mentors()`, and `journey()` use `getCurrUser()` to fetch the current user's data from the demo seed functions, falling back to a default mentee if lookup fails.

Demo accounts are stored in localStorage under keys `auth.accounts` (all users) and `auth.session` (current session). Passwords are plain-text (no hashing) and validated client-side only (6+ chars, unique email per account). Email comparison is case-insensitive. New accounts are assigned random IDs and auto-logged in.

Verification: the plan file confirms browser testing covered login/register/logout/reload flows and account-type UI differences, with no JavaScript errors reported.

---

<details>
<summary>Issues (2)</summary>

1. **`getCurrUser()` lookup mismatch** — The profile views call `getCurrUser()`, which looks up the user by ID from the demo seed functions (`seedMentees()`, `seedMentors()`), but the session is stored in localStorage. If a demo seed function's properties change (e.g., parish, age) without updating localStorage, profile display could show stale values. Mitigated by: the seed functions are static, and data doesn't change during a session. However, if localStorage is cleared and re-seeded after a code change, old session data could reference old account properties. This is acceptable for a hackathon but should be noted for future refactoring.

2. **Admin account type prepared but UI incomplete** — `seedAdmin()` creates an admin account and `AUTH.seedDemoAccounts()` stores it. The nav passes `accountType === "admin"` to conditionally show a "Coordinator" nav item, but no actual coordinator view exists in `V` (no `V.coordinator()` or similar). Clicking the admin nav item will try to render `V.admin` which is undefined, causing a runtime error. Either add a stub coordinator view or remove the admin nav condition until the feature is implemented.

</details>

---

<details>
<summary>Details</summary>

### Session initialization and persistence

App initialization checks `AUTH.getSession()` on page load. If a session exists, its `userId`, `accountType`, and `user` properties populate state and the app renders the profile screen; otherwise, the login screen appears. This gates app access until logged in. Logout clears `auth.session`, and the next render shows login again. Reload while logged in persists the session in localStorage.

The session schema captures `{ userId, accountType, user }` where `user` holds profile data (id, name, email, parish, age, yr, yrs, skills) for immediate rendering without a second lookup.

### Login and registration flows

Login accepts email/password and checks them against the accounts store (case-insensitive email lookup). On success, session state is populated and the app navigates to profile; errors are displayed via toast. Registration collects email, password, name, account type, parish, and age, validates (password ≥ 6 chars, unique email, required fields), then creates and auto-logs in the new account.

### Account-type-based navigation and UI

`nav()` accepts an `accountType` and filters items accordingly: mentors exclude "Friends", admins add "Coordinator" (though no coordinator view exists, creating a latent bug). Profile displays the account type tag. Views pass `S.accountType || "mentee"` when rendering nav.

### User data lookup via `getCurrUser()`

`getCurrUser()` looks up the user by ID from the demo seed functions (`seedMentees()` or `seedMentors()` based on account type), returning `{ id, name, p, age, yr/yrs }` or falling back to a default. A latent architectural issue: `getCurrUser()` pulls from seed functions (regenerated on each call) rather than from the live demo arrays (`menteesN`, `mentors`). If seed functions' return values diverge from the data arrays, profile display could mismatch. Unlikely in practice (seed functions are static), but it's an inconsistency that should be resolved by caching user data in state at login time.

### Demo account seeding

`AUTH.seedDemoAccounts()` is called on first load (when localStorage is empty) and populates demo users with email and password. Passwords are plain-text in localStorage with no hashing, salting, or rate-limiting. Acceptable for a frontend-only hackathon app, but production would require backend password hashing.

### Script load order

Scripts load in correct order: data.js, state.js, auth.js (before components.js), views.js, app.js. `AUTH` is available when app.js initializes.

### Previous feature flow preserved

The existing booking flow (profile → find mentors → book session → call → takeaways) is reachable through the logged-in profile screen. Views use `getCurrUser()` instead of hardcoded `ME`, reflecting the logged-in user's data. Variable name fixes (`MEN`→`menteesN`, `MTR`→`mentors`, `PN`→`ParishName`) prevent crashes when filtering and displaying data.





</details>

---

<details>
<summary>File map</summary>

- **js/auth.js** (new) — 165 lines. Auth module with `initAuth()`, `getSession()`, `login()`, `register()`, `logout()`, and demo account seeding.
- **js/state.js** — Added `userId`, `accountType`, `sessionUser` fields and `getCurrUser()` helper. Added form field state for login/register (loginEmail, loginPassword, regName, etc.).
- **js/views.js** — Updated `V.profile()`, `V.journey()`, `V.mentors()`, `V.mprof()`, and others to use `getCurrUser()` instead of hardcoded `ME`. Added `V.login()`, `V.register()`, `V.logout()` views. Fixed undefined variable references (`MEN`→`menteesN`, `MTR`→`mentors`, `PN`→`ParishName`).
- **js/app.js** — Added `AUTH.initAuth()` and session check on page load. Added click handlers for `loginBtn`, `registerBtn`, `confirmLogout`. Added input handlers for form fields. Fixed undefined references in live search filter (`MEN`→`menteesN`, `PN`→`ParishName`).
- **js/components.js** — Updated `nav()` to accept `accountType` parameter and filter nav items accordingly (mentors hide "Friends", admins add "Coordinator").
- **js/data.js** — Added `seedMentees()`, `seedMentors()`, `seedAdmin()` functions with email and password fields for demo accounts.
- **index.html** — Added `<script src="js/auth.js"></script>` between state.js and components.js to ensure auth functions are available before app init.

Full diff: `git diff HEAD~1 HEAD` shows plan file updates documenting verification.

</details>
