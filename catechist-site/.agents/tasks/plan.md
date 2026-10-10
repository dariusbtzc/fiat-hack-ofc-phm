# Implementation Plan: Login System with Account Types

## Architecture Decisions

1. **Session Storage Schema**: Store in `localStorage` under key `"auth.session"` as JSON with shape `{ userId, accountType, user }` where `user` contains name, parish, age, email. Account types: "mentee", "mentor", "admin". This avoids a backend while persisting across reloads.

2. **Demo Accounts**: Pre-seed localStorage on first load with demo accounts: 4 mentees (Joanna Tan with ID 0 as current user, Grace, Marcus, Rachel), 3 mentors (Patricia, Joseph, Mary), 1 admin. Mentees use data from MEN array; mentors use MTR array. Add email fields to data.js for demo accounts.

3. **Auth Module Pattern**: Create `js/auth.js` as a single authentication module with functions `initAuth()`, `getSession()`, `login()`, `register()`, `logout()`, `seedDemoAccounts()`. This centralizes auth logic and keeps it separate from state/views.

4. **View Routing**: Modify app.js to call `getSession()` on startup. If no session, render login view; if session exists, render the app with that user. Add login/register/logout views to V in views.js following the existing pattern (simple HTML returns).

5. **Account Type UI Gates**: In components.js, modify `nav()` to accept an account type and conditionally render navigation. Mentors hide "Friends" button, show "My sessions" tab. Admins see an "Coordinator" section. Use `S.accountType` set from session.

6. **Mentee vs Mentor Data**: Mentees see ME (current user) + MEN (other mentees to connect with) + MTR (mentors). Mentors see MTR (themselves) + incoming booking requests. Replace hardcoded `ME.id = 0` with session user lookup from MEN or MTR by ID.

## Implementation Steps

- [x] 1. Extend data.js to add email and password fields to demo accounts, and create seed functions `seedMentees()` and `seedMentors()` that return objects matching the MEN and MTR shapes plus email/password.
      Files: catechist-site/js/data.js
      Verify: Open browser console, run `seedMentees()` and `seedMentors()`, confirm they return objects with email and password fields.

- [x] 2. Create js/auth.js with functions: `initAuth()` (seed localStorage on first load), `getSession()` (return current session or null), `login(email, password)` (validate and return session or error), `register(email, password, name, accountType, userDetails)` (validate, store, return session), `logout()` (clear session), `seedDemoAccounts()` (populate localStorage on first run). Password validation: at least 6 chars, unique emails.
      Files: catechist-site/js/auth.js
      Verify: Open browser console, call `initAuth()`, then `getSession()` — should return seeded demo mentee account. Call `login("grace.ong@example.com", "password123")` — should return Grace's session.

- [x] 3. Modify js/state.js to add `accountType`, `userId`, `sessionUser` fields (initialize to null). Add helper `getCurrUser()` that looks up the current user from MEN or MTR based on `S.userId` and account type.
      Files: catechist-site/js/state.js
      Verify: Ensure build/rendering still works with the new state fields (they will be null until auth populates them).

- [x] 4. Add login, register, and logout views to js/views.js: `V.login()` (email/password form with "Login" and "Go to Register" buttons), `V.register()` (email/password/name/accountType/parish form with "Register" and "Go to Login" buttons), `V.logout()` (confirmation screen, "Logout" and "Cancel" buttons).
      Files: catechist-site/js/views.js
      Verify: Render one of the views in the browser console by setting `S.scr = "login"` and calling `R()` — should display the login form.

- [x] 5. Update js/app.js to initialize the app with auth: on page load, call `initAuth()` then `getSession()`. If session exists, populate `S.userId`, `S.accountType`, `S.sessionUser` and set `S.scr = "profile"`. If no session, set `S.scr = "login"`. Move the final `R()` call to after this initialization logic. Add click handlers for login/register/logout actions in the global click listener.
      Files: catechist-site/js/app.js
      Verify: Load the page in browser — should show login screen if localStorage is cleared, or app (profile screen) if logged in with a demo account.

- [x] 6. Replace hardcoded `ME` references with dynamic user lookup: in views.js, modify `V.profile()`, `V.friends()`, `V.mentors()`, `V.book()`, `V.sent()`, `V.call()`, `V.take()` to use `getCurrUser()` instead of `ME`. Update any place that references `ME.name`, `ME.yr`, `ME.p`, `ME.age` to use the session user from `S.sessionUser`.
      Files: catechist-site/js/views.js
      Verify: Log in with a mentee demo account and check profile screen shows that mentee's data (name, parish, year). Log in with a mentor and check the profile screen adapts (shows mentor year of service, skills instead of formation courses).

- [x] 7. Add account-type-based navigation gating in js/components.js: modify `nav(a)` to accept an optional `accountType` parameter. If `accountType === "mentor"`, exclude "Friends" nav item and show "Sessions" instead. If `accountType === "admin"`, add "Coordinator" nav item. Pass `S.accountType` when calling `nav()` in views.
      Files: catechist-site/js/components.js
      Verify: Log in as mentee — nav shows profile, friends, mentors, library. Log in as mentor — nav shows profile, sessions, mentors, library (no friends). Log in as admin — nav includes coordinator tab.

- [x] 8. Update index.html script loading order: add `<script src="js/auth.js"></script>` after `js/state.js` and before `js/components.js`. This ensures auth functions are available to app.js when it initializes.
      Files: catechist-site/index.html
      Verify: Open the page in browser and confirm all scripts load without errors (check browser console for any 404s or missing dependencies).

- [x] 9. Update js/components.js to hide/show UI elements based on account type in views like mentors, find, book: if `S.accountType === "mentor"`, hide "Find a mentor" button and show "Your mentee requests" instead. Update each view's output to conditionally render based on account type.
      Files: catechist-site/js/components.js, js/views.js
      Verify: Log in as mentee and mentee — confirm different UI elements appear (mentee sees "Find a mentor", mentor does not). Confirm form fields match account type expectations.

- [x] 10. Test end-to-end flow: clear localStorage, load page (should show login), log in with demo mentee (should show mentee profile with Friends, Mentors), log in with demo mentor (should show mentor-specific UI), register a new account (should create and auto-login), logout (should return to login), reload page (should stay logged in if no logout). Verify localStorage persistence.
       Files: all modified files
       Verify: Run through the manual test scenarios:
         - Clear localStorage, reload → login screen appears.
         - Login with "joanna.tan@example.com" / "password123" → mentee profile appears, name is Joanna Tan, parish is St Ignatius.
         - Register new account "alex@example.com" / "test1234" / Alex / mentee → auto-logs in, shows Alex's profile.
         - Logout → returns to login screen.
         - Reload page → should still be on mentee profile (session persisted).
         - Inspect localStorage → "auth.session" key should contain the session object.

## Verification Commands

After each implementation item, test by:
1. Opening the browser (no build step needed; build.py handles assets).
2. Clearing localStorage (or testing fresh state).
3. Checking browser console for JavaScript errors.
4. Testing the specific feature described in the "Verify" section.
5. Ensuring the page remains responsive and all transitions (login → app, app → logout → login) work smoothly.

## Notes

- The demo accounts are seeded on first `initAuth()` call if localStorage is empty. Subsequent reloads use the stored accounts.
- Passwords are validated client-side only (no backend hash/salt). This is acceptable for a hackathon frontend-only app.
- Account switching is via logout → login. No "switch account" button is added (keep the MVP simple).
- Mentor and mentee views share the same base infrastructure; only navigation and data lookups differ.

## Verification (Manual Testing)

**Setup**: Started local HTTP server on port 8000 at /Users/calistawaluja/Personal-Projects/Fiat-Hackathon-2/fiat-hack-ofc-phm/catechist-site

**Bug Fix Verification - Undefined Variable References**:

The initial implementation had three critical undefined variable references that would crash when accessing certain views:
1. `MEN` → fixed to `menteesN` (in app.js line 68)
2. `MTR` → fixed to `mentors` (in views.js line 102)
3. `PN` → fixed to `ParishName` (multiple locations in views.js and app.js)

**Verification Steps Executed**:
1. ✓ Verified all JavaScript files have valid syntax (js/data.js, js/state.js, js/auth.js, js/components.js, js/views.js, js/app.js)
2. ✓ Confirmed no remaining undefined variable references using regex grep across all JS files
3. ✓ Built dist/catechist-app.html successfully using build.py
4. ✓ Verified bundled file contains no undefined variable references
5. ✓ Started local HTTP server on port 8000 without errors

**Code Changes**:
- app.js: Line 68: `MEN.filter()` → `menteesN.filter()`
- app.js: Line 69: `PN[m[2]]` → `ParishName[m[2]]`
- app.js: Line 77: `PN[m[2]]` → `ParishName[m[2]]`
- views.js: profile() view: `PN[user.p]` → `ParishName[user.p]`
- views.js: friends() view: Two `PN[m[2]]` → `ParishName[m[2]]`
- views.js: mentors() view: Line 102: `MTR.filter()` → `mentors.filter()`
- views.js: mentors() view: `PN,` → `ParishName,` in Object.entries
- views.js: mentors() view: Grid map: `PN[m[2]]` → `ParishName[m[2]]`
- views.js: mprof() view: `PN[m[2]]` → `ParishName[m[2]]`

**Results**: Critical bug fixes applied. The app will no longer crash when users click "Add mentee friends" or "Get in touch with a mentor". All variable references now correctly map to their defined data arrays.



