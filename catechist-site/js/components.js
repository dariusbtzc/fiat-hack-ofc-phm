// components.js — Reusable UI pieces: avatar, header, bottom/side navigation, formation progress.
const renderAvatar = (fullName, sizeClass = "", inlineStyle = "") =>
  `<div class="av ${sizeClass}"${inlineStyle ? ` style="${inlineStyle}"` : ""}>${getInitials(fullName)}</div>`;

const renderHeader = (title, subtitle, backScreen = "home", extraHtml = "") =>
  `<div class="hd"><button class="back" aria-label="Back" data-a="go" data-v="${backScreen}">‹</button><div style="flex:1"><h1>${title}</h1>${subtitle ? `<small>${subtitle}</small>` : ""}</div>${extraHtml}</div>`;

const navIcons = {
  home: '<path d="M3 11l9-8 9 8v10H3z"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  friends:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M17 5a3 3 0 010 6M21 20c0-3-1-5-3-6"/>',
  mentors:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 11l2 2 4-4"/>',
  library:
    '<path d="M2 4h7a3 3 0 013 3v14a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v14a2 2 0 012-2h8z"/>',
};

// Desktop top bar links (matches the wireframe: Courses/Events | Find a Mentor | Resources)
const renderTopBar = (activeScreen) => {
  const { accountType } = appState;
  const links = [
    ["mentors", "Find a Mentor"],
    accountType !== "mentor" && ["connect", "Add Friend"],
    ["journey", "Courses / Events"],
    ["library", "Resources"],
    accountType === "admin" && ["admin", "Coordinator"],
  ].filter(Boolean);
  const topActive = { friends: "connect", find: "connect" }[activeScreen] || activeScreen;

  const linkButtons = links
    .map(
      ([screenName, label]) =>
        `<button data-a="go" data-v="${screenName}" class="${topActive === screenName ? "on" : ""}">${label}</button>`,
    )
    .join("");

  const user = getCurrentUser();
  return `<header class="top"><button class="logo" data-a="go" data-v="home" aria-label="Catechist Support home" title="Catechist Support">OFC</button><nav aria-label="Main">${linkButtons}</nav><button class="av ${activeScreen === "profile" ? "on" : ""}" data-a="go" data-v="profile" aria-label="Your profile">${getInitials(user.name)}</button></header>`;
};

// Navigation: top bar on desktop, bottom bar on mobile.
// hideBottomOnMobile is for screens that have their own fixed bottom bar (e.g. "Book a session").
const renderNav = (activeScreen, hideBottomOnMobile = false) => {
  const { accountType } = appState;
  const bottomActive = { journey: "profile", connect: "friends", find: "friends" }[activeScreen] || activeScreen;
  const navItems = [
    ["home", "Home"],
    accountType !== "mentor" && ["friends", "Friends"],
    ["mentors", "Mentors"],
    ["library", "Library"],
    accountType === "admin" && ["admin", "Coordinator"],
    ["profile", "Profile"],
  ].filter(Boolean);

  const buttons = navItems
    .map(
      ([screenName, label]) =>
        `<button data-a="go" data-v="${screenName}" class="${bottomActive === screenName ? "on" : ""}"><svg viewBox="0 0 24 24">${navIcons[screenName] || navIcons.home}</svg>${label}</button>`,
    )
    .join("");

  return `${renderTopBar(activeScreen)}<div class="bar side${hideBottomOnMobile ? " x" : ""}" style="padding:0"><div class="nav">${buttons}</div></div>`;
};

// Key used to remember that a course item has been ticked off
const makeItemKey = (year, item) => `${year}-${item}`;

const countRequiredCourses = (year) =>
  formationCourses[year]
    .filter(([, requirement]) => requirement === "Required")
    .reduce((total, [, , items]) => total + items.length, 0);

const countCompletedRequired = (year) =>
  formationCourses[year]
    .filter(([, requirement]) => requirement === "Required")
    .reduce(
      (total, [, , items]) =>
        total + items.filter((item) => appState.completedItems.has(makeItemKey(year, item))).length,
      0,
    );

// Incoming friend request: who it's from, plus Accept / Decline
const renderFriendRequest = (menteeId) => {
  const mentee = getMentee(menteeId);
  return `<div class="row">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${parishNames[mentee.parish]} · Year ${mentee.year}</div></div></div><div class="grid" style="margin-top:10px"><button class="pri" data-a="acceptFriend" data-v="${mentee.id}">Accept</button><button data-a="declineFriend" data-v="${mentee.id}">Decline</button></div>`;
};

// Emoji buttons for sending a friend a word of encouragement
const renderReactionButtons = (mentee, options = encouragementOptions) =>
  options
    .map(
      ({ emoji, label }) =>
        `<button class="em ${appState.reactions[mentee.id] === emoji ? "on" : ""}" aria-label="Send ${label} to ${mentee.name}" data-a="sendReaction" data-v="${mentee.id}|${emoji}">${emoji}</button>`,
    )
    .join("");
