// components.js — Reusable UI pieces: avatar, header, bottom/side navigation, formation progress.
const renderAvatar = (n, c = "") => `<div class="av ${c}">${getInitials(n)}</div>`;
const renderHeader = (t, sub, back = "profile", extra = "") =>
  `<div class="hd"><button class="back" aria-label="Back" data-a="go" data-v="${back}">‹</button><div style="flex:1"><h1>${t}</h1>${sub ? `<small>${sub}</small>` : ""}</div>${extra}</div>`;
const navIcons = {
  profile: '<path d="M3 11l9-8 9 8v10H3z"/>',
  friends:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M17 5a3 3 0 010 6M21 20c0-3-1-5-3-6"/>',
  mentors:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 11l2 2 4-4"/>',
  library:
    '<path d="M2 4h7a3 3 0 013 3v14a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v14a2 2 0 012-2h8z"/>',
};
const nav = (accountType, active) =>
  `<div class="bar side" style="padding:0"><div class="nav">${[
    ["profile", "Profile"],
    accountType !== "mentor" && ["friends", "Friends"],
    ["mentors", "Mentors"],
    ["library", "Library"],
    accountType === "admin" && ["admin", "Coordinator"],
    ["logout", "Logout"],
  ]
    .filter(Boolean)
    .map(
      ([k, l]) =>
        `<button data-a="${k === "logout" ? "go" : "go"}" data-v="${k}" class="${active == k ? "on" : ""}"><svg viewBox="0 0 24 24">${navIcons[k] || '<path d="M3 11l9-8 9 8v10H3z"/>'}</svg>${l}</button>`,
    )
    .join("")}</div><div style="padding:10px;text-align:center;font-size:12px;color:var(--mut)">${appState.sessionUser ? `${appState.sessionUser.name}` : ""}</div></div>`;
const countRequiredCourses = (year) =>
  formationCourses[year]
    .filter((group) => group[1] == "Required")
    .reduce((total, group) => total + group[2].length, 0);
const countCompletedRequired = (year) =>
  formationCourses[year]
    .filter((group) => group[1] == "Required")
    .reduce((total, group) => total + group[2].filter((item) => appState.done.has(year + item)).length, 0);
