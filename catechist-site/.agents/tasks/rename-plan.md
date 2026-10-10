# Implementation Plan: Rename Single-Letter Identifiers for Code Readability

## Overview
This is a rename-only refactor to replace terse, single-letter identifiers with descriptive, readable names. All functionality, behavior, and data shapes remain unchanged.

## Naming Decisions

### Global Objects
- `S` → `appState`: holds UI state (current screen, form inputs, session data, etc.)
- `V` → `screenViews`: object with render functions for each screen
- `$` → `querySelector`: DOM lookup helper (native `document.querySelector` already exists, so using full name for clarity)
- `AUTH` → keep as-is (already descriptive; only 4 chars and denotes a module)
- `IC` → `navIcons`: navigation icon SVG paths

### Functions
- `R()` → `renderApp()`: main render/router function
- `res()` → `updateSearchResults()`: search results renderer
- `toast()` → `showToast()`: notification display
- `av()` → `renderAvatar()`: avatar HTML generator
- `hd()` → `renderHeader()`: header HTML generator
- `ini()` → `getInitials()`: extract initials from name
- `mn()` → `getMentee()`: lookup mentee by ID
- `mt()` → `getMentor()`: lookup mentor by ID

### Data & Constants
- `menteesN` → keep (already reasonably named; N indicates "nested array format")
- `mentors` → keep (already clear)
- `ParishName` → keep (already clear)
- `formationCourses` → keep (already clear)
- `skills` → keep (already clear)
- `topics` → keep (already clear)
- `libraryCategories` → keep (already clear)
- `days` → keep (already clear)
- `times` → keep (already clear)

### appState Properties
Single-letter properties remain as-is to preserve internal state shape (required for data persistence, session storage, etc.). Rename only happens at reference sites, and properties accessed as `appState.prop` read naturally.

### Local Variables Inside Functions
All function parameters and local variables with single letters will be renamed to descriptive names:
- Event handlers: `e` → `event` or specific name (`inputElement`, `timeRemaining`, etc.)
- Query/search: `q` → `queryInput` or `query`
- Time countdown: `t` → `updateTimer` or `timeRemaining`
- Mentee/mentor arrays: `m` → specific name
- Indexes/IDs: `i` → `index` or `menteeId`
- Generic: `x` → descriptive name in context
- Buttons: `target` (already done in most places)

---

## Implementation Order

**Dependency chain**: Start with definitions (state.js), then functions (components.js → app.js), then usages (views.js).

### 1. Rename in state.js
Define `appState` and helper functions with new names.

**Files**: `js/state.js`

**Changes**:
- Line 2: `const S =` → `const appState =`
- Line 36: `const $ =` → `const querySelector =`
- Lines 37–40: `ini =` → `getInitials =`
- Lines 42–43: `mn =` → `getMentee =`
- Lines 44–45: `mt =` → `getMentor =`
- All internal references updated

**Verification**: 
```bash
# Check that state.js contains renamed definitions
grep -n "const appState =" js/state.js
grep -n "const querySelector =" js/state.js
grep -n "getInitials =" js/state.js
grep -n "getMentee =" js/state.js
grep -n "getMentor =" js/state.js
```

---

### 2. Rename in components.js
Update function names and references to state/helpers.

**Files**: `js/components.js`

**Changes**:
- Line 3: `const av =` → `const renderAvatar =`
- Line 4: `const hd =` → `const renderHeader =`
- Line 5: `const IC =` → `const navIcons =`
- Line 30–33: local functions `req()` → `countRequiredCourses()`, `reqDone()` → `countCompletedRequired()`
- All usages of `S` → `appState`, `IC` → `navIcons`
- Functions called: `ini(n)` → `getInitials(n)`, `S.done` → `appState.done`, `S.sessionUser` → `appState.sessionUser`, `formationCourses` references

**Verification**:
```bash
grep -n "const renderAvatar" js/components.js
grep -n "const renderHeader" js/components.js
grep -n "const navIcons" js/components.js
grep -n "appState" js/components.js
```

---

### 3. Rename in app.js
Update main render function, event handlers, and local variables.

**Files**: `js/app.js`

**Changes**:
- Line 2: `function R()` → `function renderApp()`
- Line 65: `function res()` → `function updateSearchResults()`
- Line 81: `function toast()` → `function showToast()`
- All `S.` → `appState.`
- All `V[` → `screenViews[`
- All `$("` → `querySelector("`
- Local variables in functions:
  - Line 21: `const q = $("#q")` → `const searchInput = querySelector("#q")`
  - Line 22: `q.oninput =` → `searchInput.oninput =`
  - Line 23: `S.q = q.value` → `appState.q = searchInput.value`
  - Line 29: `const t = () => {` → `const updateTimer = () => {` (timer update closure)
  - Line 30: `const e = $("#tm")` → `const timerDisplay = querySelector("#tm")`
  - Line 46: `const loginEmail = $("#loginEmail")` → keep as-is (already descriptive)
  - Line 47: `const loginPassword = $("#loginPassword")` → keep as-is (already descriptive)
  - Similar rename for register form variables (already descriptive)
  - Line 66: `const query = S.q.toLowerCase()` → `const query = appState.q.toLowerCase()`
  - Line 75: `const isFriend =` → keep as-is (already descriptive)
  - Line 77: `av(mentee[1])` → `renderAvatar(mentee[1])`
  - Line 182: `S.req.has(id)` → `appState.req.has(id)`
  - Line 197: `const [i, em] = value.split("|")` → `const [index, emoji] = value.split("|")`
  - Line 198: `S.rx[i] = em` → `appState.rx[index] = emoji`
  - Line 198: `toast("Sent " + em)` → `showToast("Sent " + emoji)`
- Function calls renamed:
  - Line 24: `res()` → `updateSearchResults()`
  - Line 95–104: all `R()` → `renderApp()`
  - Line 126–175: all `toast(...)` → `showToast(...)`
- Event handler closures: event parameter `e` → `event` or specific name

**Verification**:
```bash
grep -n "function renderApp" js/app.js
grep -n "function updateSearchResults" js/app.js
grep -n "function showToast" js/app.js
grep "appState\." js/app.js | head -10
grep "screenViews\[" js/app.js | head -5
grep "querySelector" js/app.js | head -10
```

---

### 4. Rename in components.js calls within views.js
Update all calls to component functions in render output.

**Files**: `js/views.js`

**Changes**:
- All `av(...)` → `renderAvatar(...)`
- All `hd(...)` → `renderHeader(...)`
- All `mn(...)` → `getMentee(...)`
- All `mt(...)` → `getMentor(...)`
- All `S.` → `appState.`
- Line 84: `const mentee = mn(id)` → `const mentee = getMentee(id)`
- Line 102: `const mentorsList = mentors.filter(...)` filter uses `S.pf`, `S.af`, `S.sf` → `appState.pf`, etc.
- All references to `getCurrUser()`, `days`, `dl()`, `times`, `booked()`, `formationCourses`, `topics`, `skills`, `libraryCategories`, `seedMentees()`, `seedMentors()`, etc. remain unchanged (already clear or internal helpers)

**Verification**:
```bash
grep -c "renderAvatar" js/views.js
grep -c "renderHeader" js/views.js
grep -c "getMentee" js/views.js
grep -c "getMentor" js/views.js
grep "appState\." js/views.js | wc -l
```

---

### 5. Update HTML script load order and app initialization
Ensure all scripts are loaded in correct dependency order and initialization uses renamed functions.

**Files**: `index.html`, `js/app.js` (end of file)

**Changes**:
- HTML: already correct order (data.js → state.js → auth.js → components.js → views.js → app.js)
- Line 283–291 in app.js:
  - `R()` → `renderApp()`
  - `AUTH.getSession()` → stays (AUTH module name kept)
  - `S.userId =` → `appState.userId =`
  - `S.accountType =` → `appState.accountType =`
  - `S.sessionUser =` → `appState.sessionUser =`
  - `S.scr =` → `appState.scr =`

**Verification**:
```bash
# Check app.js initialization at end
tail -15 js/app.js | grep -E "renderApp|appState"
```

---

### 6. Verify no remaining references to old names
Ensure no undefined references remain.

**Files**: all JS files

**Verification**:
```bash
# Search for remaining single-letter function/object references
grep -E "\bR\(|\bV\[|\$\(|function res\(|function toast\(|function av\(|function hd\(|function ini\(|function mn\(|function mt\(" js/*.js

# Expected: NO results (all renamed)

# Search for references to renamed state object
grep -E "\bS\b(?!\.)" js/*.js || echo "No unqualified S references found (good)"

# Check that appState is used everywhere instead
grep "appState\." js/*.js | wc -l

# Expected: many results
```

---

## Testing Checklist

After all renames are complete, verify functionality:

1. **No console errors**: Open DevTools → Console tab; no undefined reference errors
2. **Page loads**: App initializes with login screen
3. **Login works**: Use demo account `joanna.tan@example.com` / `password123`
4. **Navigation works**: Click Profile, Friends, Mentors, Library buttons; screens render
5. **Search works**: Go to Friends tab, add friend; search by name or parish; results display
6. **Form inputs work**: Go to Mentors, book a session; select date/time/topics; form state updates
7. **Notifications work**: Click actions; toast messages appear and disappear
8. **Timer works**: Go to call screen; timer counts down
9. **Session persists**: Refresh page; logged-in state preserved
10. **Logout works**: Click Logout; session cleared; redirected to login

---

## Files Modified

- `js/state.js`: state object, querySelector helper, getInitials, getMentee, getMentor
- `js/components.js`: renderAvatar, renderHeader, navIcons, countRequiredCourses, countCompletedRequired
- `js/app.js`: renderApp, updateSearchResults, showToast, all event handlers, initialization
- `js/views.js`: all calls to renderAvatar, renderHeader, getMentee, getMentor, appState references
- `index.html`: no changes (script load order already correct)
- `js/auth.js`: no changes (AUTH module name kept; seedMentees, seedMentors already descriptive)
- `js/data.js`: no changes (constants already clear)

---

## Rollback Plan

If a critical issue arises during implementation:
1. Each file's changes are independent; roll back individual files via git
2. Run `git diff js/state.js` to see changes before committing
3. If needed, `git checkout js/state.js` to revert a single file

---

## Notes

- **State shape preserved**: appState properties remain unchanged (single letters). Rename only happens at reference sites.
- **No logic changes**: All conditionals, loops, and data transformations remain identical.
- **Backward compatibility**: Not applicable; internal refactor.
- **Session storage**: unaffected; auth.js uses its own keys, not state object.
