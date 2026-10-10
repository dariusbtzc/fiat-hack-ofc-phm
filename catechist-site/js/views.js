// views.js — One render function per screen (profile, journey, find, friends, library, mentors, mprof, book, sent, call, take).
// Home screen: the four "connect" boxes (add a friend, encouragement, peer support, fellowship groups)
const renderConnectSection = (user) => {
  const friendsList = menteeDirectory.filter((mentee) => appState.friends.has(mentee.id));

  const renderChips = (options, current, action) =>
    options
      .map(
        ([value, label]) =>
          `<button class="chip ${current === value ? "on" : ""}" data-a="${action}" data-v="${value}">${label}</button>`,
      )
      .join("");

  // 1. Add a friend, in your parish or outside it
  const scopeOptions = [["all", "All"], ["same", "My parish"], ["other", "Other parishes"]];
  const levelOptions = [[0, "Any level"], [1, "Year 1"], [2, "Year 2"], [3, "Year 3"], [4, "Year 4+"]];
  const suggestions = getSuggestedFriends();
  const shownSuggestions = suggestions.slice(0, 4);
  const hiddenCount = suggestions.length - shownSuggestions.length;

  const requestsBlock = appState.incomingRequests.length
    ? `<div class="b" style="margin-bottom:8px">Friend requests (${appState.incomingRequests.length})</div>${appState.incomingRequests
        .map((menteeId) => `<div style="margin-bottom:14px">${renderFriendRequest(menteeId)}</div>`)
        .join("")}<div style="border-top:1px solid var(--bd);margin:4px 0 12px"></div>`
    : "";

  const suggestionRows = shownSuggestions.length
    ? shownSuggestions
        .map((mentee) => {
          const isRequested = appState.sentRequests.has(mentee.id);
          const isSameParish = mentee.parish === user.parish;
          return `<div class="row" style="margin-bottom:10px">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${parishNames[mentee.parish]} · Year ${mentee.year}</div>${isSameParish ? '<span class="tag" style="background:var(--soft);color:var(--pri);margin-top:4px">Your parish</span>' : ""}</div><button class="${isRequested ? "sft" : "pri"}" data-a="toggleFriendRequest" data-v="${mentee.id}">${isRequested ? "Requested" : "Add"}</button></div>`;
        })
        .join("")
    : `<p class="mut">No catechists match these filters. Try another parish or level.</p>`;

  const addFriendCard = `<section class="card" id="suggestions"><h3 style="font-size:16px">Add a friend</h3><div class="mut" style="margin:2px 0 12px">Connect with catechists in your parish or beyond.</div>${requestsBlock}
<div class="mut">Parish</div><div style="overflow-x:auto;white-space:nowrap">${renderChips(scopeOptions, appState.suggestionScope, "setSuggestionScope")}</div>
<div class="mut">Experience</div><div style="overflow-x:auto;white-space:nowrap;margin-bottom:6px">${renderChips(levelOptions, appState.suggestionYear, "setSuggestionYear")}</div>
${suggestionRows}<button class="sft full" data-a="go" data-v="find">${hiddenCount > 0 ? `Search all (${hiddenCount} more) ›` : "Search the directory ›"}</button></section>`;

  // 2. Support each other with digital encouragement
  const encouragementRows = friendsList.length
    ? friendsList
        .slice(0, 4)
        .map((mentee) => {
          const sentEmoji = appState.reactions[mentee.id];
          return `<div class="row" style="margin-bottom:10px">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${sentEmoji ? "You sent " + sentEmoji : `${parishNames[mentee.parish]} · Year ${mentee.year}`}</div></div>${renderReactionButtons(mentee)}</div>`;
        })
        .join("") + `<button class="sft full" data-a="go" data-v="friends">All friends (${friendsList.length}) ›</button>`
    : `<p class="mut">Add a friend to start sending encouragement.</p>`;

  const encouragementCard = `<section class="card"><h3 style="font-size:16px">Send encouragement</h3><div class="mut" style="margin:2px 0 12px">Lift each other up with a quick digital word.</div>${encouragementRows}</section>`;

  // 3. Peer support across all experience levels
  const levels = [1, 2, 3, 4].map((level) => ({
    level,
    count: friendsList.filter((mentee) => Math.min(mentee.year, 4) === level).length,
  }));
  const levelsCovered = levels.filter(({ count }) => count > 0).length;
  const levelRows = levels
    .map(
      ({ level, count }) =>
        `<div class="row" style="margin-bottom:10px"><span class="b" style="width:66px;flex:none;white-space:nowrap">${level === 4 ? "Year 4+" : `Year ${level}`}</span><div class="g"><div class="meter"><div style="width:${friendsList.length ? Math.round((count / friendsList.length) * 100) : 0}%"></div></div></div>${count ? `<span class="mut" style="width:70px;flex:none;text-align:right">${count} friend${count > 1 ? "s" : ""}</span>` : `<button class="sft" style="min-height:36px;padding:0 12px;flex:none" data-a="findPeersAtLevel" data-v="${level}">Find</button>`}</div>`,
    )
    .join("");

  const peerCard = `<section class="card"><h3 style="font-size:16px">Peer support at every level</h3><div class="mut" style="margin:2px 0 12px">Your friends cover ${levelsCovered} of 4 experience levels. Newer and seasoned catechists learn from each other.</div>${levelRows}</section>`;

  // 4. Fellowship groups recommended from your network
  const recommendations = getFellowshipRecommendations();
  const groupRows = recommendations.length
    ? `<div class="groups">` + recommendations
        .map((group) => {
          const isCreated = appState.fellowshipGroups.has(group.id);
          const memberNames = group.members.map((mentee) => mentee.name.split(" ")[0]).join(", ");
          return `<div class="row" style="margin-bottom:12px"><div class="g"><div class="b">${group.name}</div><div class="mut">${group.description}</div><div class="mut">${memberNames} + you</div></div><button class="${isCreated ? "sft" : "pri"}" ${isCreated ? "disabled" : ""} data-a="createFellowshipGroup" data-v="${group.id}">${isCreated ? "Created ✓" : "Create"}</button></div>`;
        })
        .join("") + `</div>`
    : `<p class="mut">Add a few more friends and we'll recommend fellowship groups from your network.</p>`;

  const fellowshipCard = `<section class="card"><h3 style="font-size:16px">Fellowship groups</h3><div class="mut" style="margin:2px 0 12px">Recommended from your network. Create one and invite everyone.</div>${groupRows}</section>`;

  return `<div class="home-cols">${addFriendCard}<div class="stack">${encouragementCard}${peerCard}</div><div class="span-all">${fellowshipCard}</div></div>`;
};

const screenViews = {
  login() {
    return `<div class="pad" style="padding-top:60px;text-align:center;max-width:560px;margin:0 auto">
<div style="font-size:44px">✝️</div>
<h1 style="margin-top:16px">Catechist Support</h1>
<p class="mut">Mentoring & growth for catechists</p>
<div class="card" style="text-align:left;margin-top:32px">
<h2 style="margin-top:0">Login</h2>
<input type="email" id="loginEmail" placeholder="Email" aria-label="Email" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${appState.loginEmail}">
<input type="password" id="loginPassword" placeholder="Password" aria-label="Password" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${appState.loginPassword}">
<button class="pri full" data-a="login">Login</button>
<button class="full" style="margin-top:6px" data-a="go" data-v="register">Create an account</button>
</div>
<p class="mut" style="margin-top:16px;font-size:12px">Demo: joanna.tan@example.com / password123</p>
</div>`;
  },

  register() {
    return `<div class="pad" style="padding-top:40px;text-align:center;max-width:560px;margin:0 auto">
<h1>Create Account</h1>
<div class="card" style="text-align:left">
<input type="text" id="regName" placeholder="Name" aria-label="Name" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${appState.regName}">
<input type="email" id="regEmail" placeholder="Email" aria-label="Email" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${appState.regEmail}">
<input type="password" id="regPassword" placeholder="Password (min 6 chars)" aria-label="Password" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${appState.regPassword}">
<select id="regAccountType" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="mentee" ${appState.regAccountType === "mentee" ? "selected" : ""}>Mentee (trainee catechist)</option>
<option value="mentor" ${appState.regAccountType === "mentor" ? "selected" : ""}>Mentor (experienced catechist)</option>
</select>
<select id="regParish" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="ig" ${appState.regParish === "ig" ? "selected" : ""}>St Ignatius</option>
<option value="hs" ${appState.regParish === "hs" ? "selected" : ""}>Holy Spirit</option>
<option value="rc" ${appState.regParish === "rc" ? "selected" : ""}>Risen Christ</option>
<option value="gs" ${appState.regParish === "gs" ? "selected" : ""}>Good Shepherd</option>
</select>
<select id="regAge" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="20s" ${appState.regAge === "20s" ? "selected" : ""}>20s</option>
<option value="30s" ${appState.regAge === "30s" ? "selected" : ""}>30s</option>
<option value="40s" ${appState.regAge === "40s" ? "selected" : ""}>40s</option>
<option value="50s+" ${appState.regAge === "50s+" ? "selected" : ""}>50s+</option>
</select>
<button class="pri full" data-a="register">Create Account</button>
<button class="full" style="margin-top:6px" data-a="go" data-v="login">Back to login</button>
</div>
</div>`;
  },

  logout() {
    return `<div class="pad" style="padding-top:60px;text-align:center;max-width:560px;margin:0 auto">
<div style="font-size:44px">👋</div>
<h1 style="margin-top:16px">Logout</h1>
<p>Are you sure you want to log out?</p>
<div class="grid" style="margin-top:32px">
<button class="pri" data-a="confirmLogout">Yes, logout</button>
<button data-a="go" data-v="profile">Cancel</button>
</div>
</div>`;
  },

  home() {
    const user = getCurrentUser() || fallbackUser;
    const isMentor = appState.accountType === "mentor";
    const friendsList = menteeDirectory.filter((mentee) => appState.friends.has(mentee.id));

    // Big hero: Find a mentor / Coach a mentee
    const hero = isMentor
      ? {
          title: "Coach a mentee",
          text: "Walk alongside a newer catechist and share what you've learnt.",
          button: `<button data-a="comingSoon">Coach a mentee</button>`,
        }
      : {
          title: "Find a mentor",
          text: "Book a 30-minute video session with an experienced catechist.",
          button: `<button data-a="go" data-v="mentors">Find a mentor</button>`,
        };

    // Box 1: Friends (summary; the full tools are on the Add Friend page)
    const requestCount = appState.incomingRequests.length;
    const requestBanner = requestCount
      ? `<button class="gold full" style="margin-bottom:12px;text-align:left" data-a="go" data-v="connect">${requestCount} friend request${requestCount > 1 ? "s" : ""} waiting ›</button>`
      : "";
    const friendRows = friendsList.length
      ? friendsList
          .slice(0, 3)
          .map((mentee) => {
            const sentEmoji = appState.reactions[mentee.id];
            return `<div class="row" style="margin-bottom:10px">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${sentEmoji ? "You sent " + sentEmoji : parishNames[mentee.parish]}</div></div>${renderReactionButtons(mentee, encouragementOptions.slice(0, 2))}</div>`;
          })
          .join("")
      : `<p class="mut">No friends yet. Add a catechist to get started.</p>`;
    const friendsBox = isMentor
      ? ""
      : `<section class="card"><div class="row" style="margin-bottom:4px"><h3 class="g" style="font-size:16px">Friends</h3><span class="tag" style="margin:0">${friendsList.length}</span></div><div class="mut" style="margin-bottom:12px">Send a quick word of encouragement.</div>${requestBanner}${friendRows}<div class="grid" style="margin-top:12px"><button class="sft" data-a="go" data-v="friends">All friends</button><button class="pri" data-a="go" data-v="connect">Add friend</button></div></section>`;

    // Box 2: Find a mentor / Coach a mentee
    const recommendedMentors = [...mentorDirectory]
      .sort((a, b) => Number(b.parish === user.parish) - Number(a.parish === user.parish))
      .slice(0, 2);
    const mentorRows = recommendedMentors
      .map(
        (mentor) =>
          `<div class="row" style="margin-bottom:10px">${renderAvatar(mentor.name)}<div class="g"><div class="b">${mentor.name}</div><div class="mut">${parishNames[mentor.parish]} · ${mentor.skills[0]}</div></div><button class="sft" data-a="viewMentor" data-v="${mentor.id}">View</button></div>`,
      )
      .join("");
    const mentorBox = isMentor
      ? `<section class="card"><h3 style="font-size:16px">Coach a mentee</h3><div class="mut" style="margin:2px 0 12px">Requests from mentees will appear here.</div><button class="sft full" data-a="comingSoon">Coach a mentee ›</button></section>`
      : `<section class="card"><h3 style="font-size:16px">Find a mentor</h3><div class="mut" style="margin:2px 0 12px">Mentors from your parish come first.</div>${mentorRows}<button class="sft full" data-a="go" data-v="mentors">Browse all mentors ›</button></section>`;

    // Box 3: Upcoming courses / events
    const eventRows = upcomingEvents
      .map(
        (event) =>
          `<div class="row" style="margin-bottom:12px"><div class="av gold" style="border-radius:10px;font-size:12px;text-align:center">${event.day}<br>${event.month}</div><div><div class="b">${event.title}</div><div class="mut">${event.detail}</div></div></div>`,
      )
      .join("");
    const upcomingBox = `<section class="card"><h3 style="font-size:16px">Upcoming courses / events</h3><div class="mut" style="margin:2px 0 12px">Formation and gatherings near you.</div>${eventRows}<button class="sft full" data-a="go" data-v="journey">View formation courses ›</button></section>`;

    return `<div class="pad wide"><section class="hero"><div class="mut" style="color:inherit;opacity:.85">Welcome back, ${user.name.split(" ")[0]}</div><h1>${hero.title}</h1><p>${hero.text}</p>${hero.button}</section>
<div class="home-trio">${friendsBox}${mentorBox}${upcomingBox}</div></div>${renderNav(appState.accountType || "mentee", "home")}`;
  },

  connect() {
    const user = getCurrentUser() || fallbackUser;
    return `${renderHeader("Add a friend", "Connect, encourage and grow together")}<div class="pad" style="margin-top:12px">${renderConnectSection(user)}</div>${renderNav(appState.accountType || "mentee", "connect")}`;
  },

  profile() {
    const user = getCurrentUser() || fallbackUser;
    return `<div class="ban"></div><div class="pad" style="margin-top:-44px"><div class="card" style="padding-top:0"><div style="display:flex;justify-content:space-between;align-items:flex-end">${renderAvatar(user.name, "l")}<button class="tag gold" style="border:0;min-height:44px" data-a="go" data-v="journey">Year ${user.year || 1} ›</button></div>
<h1 style="margin-top:8px">${user.name}</h1><div class="mut" style="margin:2px 0 8px">${parishNames[user.parish]}</div><span class="tag sft" style="background:var(--soft);color:var(--pri)">${appState.accountType === "mentor" ? "Mentor" : "Mentee"}</span><span class="tag">${user.age}</span><span class="tag">Catechist</span>
<div class="row" style="margin-top:10px"><button class="g" style="border:0;text-align:left;background:none;padding:0" data-a="go" data-v="friends"><span class="b" style="font-size:18px">${appState.friends.size}</span> <span class="mut">friends</span></button><div class="g"><span class="b" style="font-size:18px">${appState.sessionCount}</span> <span class="mut">mentor sessions</span></div></div></div>
<div class="card row"><div class="av" style="background:var(--gold);color:var(--goldt)">★</div><div><div class="b">1 year of service</div><div class="mut">Thank you for your ministry, ${user.name}.</div></div></div><h2>Grow</h2><div class="grid"><button class="pri" style="padding:16px;text-align:left;border-radius:14px" data-a="go" data-v="connect">Add mentee friends</button><button class="pri" style="padding:16px;text-align:left;border-radius:14px" data-a="go" data-v="mentors">Get in touch with a mentor</button></div>
<button class="full card" style="margin-top:10px;text-align:left" data-a="go" data-v="library">Library <span class="tag" style="margin-left:6px">Nice-to-have</span></button>
<button class="full" style="margin:16px 0" data-a="go" data-v="logout">Log out</button></div>${renderNav(appState.accountType || "mentee", "profile")}`;
  },

  journey() {
    const year = appState.journeyYear;
    const courses = formationCourses[year];
    const currentUserYear = getCurrentUser()?.year || fallbackUser.year;
    return `${renderHeader("My formation journey", "Formation courses by the Office for Catechesis")}<div class="pad" style="margin-top:12px"><div class="sw">${[1, 2, 3, 4].map((yearNumber) => `<button class="chip ${yearNumber === year ? "on" : ""}" style="flex:1;margin:0;padding:0" data-a="selectYear" data-v="${yearNumber}">Year ${yearNumber}${yearNumber === 4 ? "+" : ""}</button>`).join("")}</div>
<div class="card pri" style="background:var(--pri);color:var(--on)"><div class="b" style="color:inherit">${year === currentUserYear ? `You're in Year ${year}` : `Year ${year}`}</div>${countCompletedRequired(year)} of ${countRequiredCourses(year)} required items done</div>
${courses.map(([title, requirement, items]) => `<div class="card"><div class="row"><h3 class="g">${title}</h3><span class="tag ${requirement === "Required" ? "gold" : ""}">${requirement}</span></div>${items.map((item) => `<label class="row" style="min-height:44px"><input type="checkbox" data-a="toggleCourseItem" data-v="${makeItemKey(year, item)}" ${appState.completedItems.has(makeItemKey(year, item)) ? "checked" : ""} style="width:20px;height:20px"> ${item}</label>`).join("")}</div>`).join("")}</div>`;
  },

  find() {
    return `${renderHeader("Find mentee friends", "", "connect")}<div class="pad" style="margin-top:12px"><input type="search" id="q" placeholder="Search by name or parish" aria-label="Search by name or parish" value="${appState.searchQuery}"><div id="res"></div></div>${renderNav(appState.accountType || "mentee", "connect")}`;
  },

  friends() {
    const friendsList = menteeDirectory.filter((mentee) => appState.friends.has(mentee.id));
    const requestsSection = appState.incomingRequests.length
      ? `<h2>Friend requests (${appState.incomingRequests.length})</h2>${appState.incomingRequests
          .map((menteeId) => `<div class="card">${renderFriendRequest(menteeId)}</div>`)
          .join("")}`
      : "";

    const friendCards = friendsList
      .map((mentee) => {
        const sentEmoji = appState.reactions[mentee.id];
        return `<div class="card row">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${sentEmoji ? "You sent " + sentEmoji : parishNames[mentee.parish]}</div></div>${renderReactionButtons(mentee)}</div>`;
      })
      .join("");

    return `${renderHeader("Friends", "Send a quick word of encouragement", "home", `<button class="sft" data-a="go" data-v="connect">Add</button>`)}<div class="pad">
${requestsSection}
<h2>My friends (${friendsList.length})</h2>${friendCards}</div>${renderNav(appState.accountType || "mentee", "friends")}`;
  },

  library() {
    return `${renderHeader("Library", "", "home", '<span class="tag">Nice-to-have</span>')}<div class="pad" style="margin-top:12px"><input type="search" placeholder="Search resources" aria-label="Search resources" style="margin-bottom:10px">${libraryCategories.map((category) => `<button class="full card" style="text-align:left;min-height:0" data-a="toggleLibraryCategory" data-v="${category}"><span class="b">${category}</span>${appState.openLibraryCategory === category ? '<div class="mut" style="margin-top:8px;font-weight:400">[Resources to be added: articles, lesson plans, videos]</div>' : ""}</button>`).join("")}</div>${renderNav(appState.accountType || "mentee", "library")}`;
  },

  mentors() {
    const user = getCurrentUser() || fallbackUser;
    const isInUserParish = (mentor) => Number(mentor.parish === user.parish);

    const matchingMentors = mentorDirectory
      .filter(
        (mentor) =>
          (!appState.parishFilter || mentor.parish === appState.parishFilter) &&
          (!appState.ageFilter || mentor.age === appState.ageFilter) &&
          (!appState.skillFilter || mentor.skills.includes(appState.skillFilter)),
      )
      .sort((a, b) => isInUserParish(b) - isInUserParish(a)); // mentors from the user's parish first

    const parishOptions = Object.entries(parishNames)
      .map(
        ([code, name]) =>
          `<option value="${code}" ${appState.parishFilter === code ? "selected" : ""}>${name}</option>`,
      )
      .join("");
    const ageOptions = ageRanges
      .map((age) => `<option ${appState.ageFilter === age ? "selected" : ""}>${age}</option>`)
      .join("");
    const skillChips = ["", ...mentorSkills]
      .map(
        (skill) =>
          `<button class="chip ${appState.skillFilter === skill ? "on" : ""}" data-a="selectSkill" data-v="${skill}">${skill || "All"}</button>`,
      )
      .join("");

    const mentorCards = matchingMentors
      .map(
        (mentor) =>
          `<div class="card" style="text-align:center">${renderAvatar(mentor.name, "", "margin:0 auto 6px;")}<div class="b">${mentor.name}</div><div class="mut">${parishNames[mentor.parish]}<br>${mentor.age} · ${mentor.yearsServing} yrs serving</div>${mentor.parish === user.parish ? '<span class="tag" style="background:var(--soft);color:var(--pri)">Your parish</span> ' : ""}<span class="tag gold" style="margin-top:6px">${mentor.skills[0]}</span><button class="sft full" style="margin-top:6px" data-a="viewMentor" data-v="${mentor.id}">View profile</button></div>`,
      )
      .join("");

    return `${renderHeader("Find a mentor")}<div class="pad" style="margin-top:12px"><div class="grid"><select aria-label="Parish" data-a="filterParish"><option value="">All parishes</option>${parishOptions}</select><select aria-label="Age" data-a="filterAge"><option value="">Any age</option>${ageOptions}</select></div>
<div style="margin:10px 0;overflow-x:auto;white-space:nowrap">${skillChips}</div><div class="mut" style="margin-bottom:8px">${matchingMentors.length} mentors match</div>
<div class="grid g3">${mentorCards}</div></div>${renderNav(appState.accountType || "mentee", "mentors")}`;
  },

  mprof() {
    const mentor = getMentor(appState.mentorId);
    return `<div class="ban" style="height:110px"></div><div class="mb" style="position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:10px"><button class="back" aria-label="Back" data-a="go" data-v="mentors">‹</button></div><div class="pad" style="margin-top:-36px">${renderAvatar(mentor.name, "l")}<h1 style="margin-top:8px">${mentor.name}</h1><div class="mut">${parishNames[mentor.parish]}</div><div style="margin-top:8px"><span class="tag gold">Mentor</span><span class="tag">${mentor.age}</span><span class="tag">${mentor.yearsServing} yrs serving</span></div>
<h2>About</h2><p>[Mentor bio] ${mentor.name} has served as a catechist for ${mentor.yearsServing} years and enjoys walking with newer catechists.</p><h2>Specialisation</h2>${mentor.skills.map((skill) => `<span class="tag gold">${skill}</span>`).join("")}
<div class="card" style="margin-top:14px"><div class="b">30-minute video sessions</div><div class="mut">Usually available weekday evenings</div></div></div><div class="bar"><button class="pri full" data-a="go" data-v="book">Book a session</button></div>`;
  },

  book() {
    const mentor = getMentor(appState.mentorId);
    const { selectedDayIndex, selectedTime, topics } = appState;
    const isReady = selectedDayIndex != null && selectedTime && topics.length;

    const dateChips = upcomingDays
      .map(
        (day, dayIndex) =>
          `<button class="chip ${selectedDayIndex === dayIndex ? "on" : ""}" data-a="selectDate" data-v="${dayIndex}">${formatDayLabel(day)}</button>`,
      )
      .join("");

    const timeChips = timeSlots
      .map((slot, timeIndex) =>
        isSlotBooked(mentor.id, selectedDayIndex, timeIndex)
          ? ""
          : `<button class="chip ${selectedTime === slot ? "on" : ""}" style="margin:0" data-a="selectTime" data-v="${slot}">${slot}</button>`,
      )
      .join("");

    const topicChips = sessionTopics
      .map(
        (topic) =>
          `<button class="chip ${topics.includes(topic) ? "on" : ""}" data-a="toggleTopic" data-v="${topic}">${topic}</button>`,
      )
      .join("");

    const summary = isReady
      ? `${formatDayLabel(upcomingDays[selectedDayIndex])} · ${selectedTime} · ${topics.length} topic${topics.length > 1 ? "s" : ""}`
      : "Pick a date, time and at least one topic";

    return `${renderHeader("Book a session", `with ${mentor.name} · 30 min video call`, "mprof")}<div class="pad"><h2>Choose a date</h2><div style="overflow-x:auto;white-space:nowrap">${dateChips}</div>
${selectedDayIndex != null ? `<h2>Choose a time</h2><div class="grid">${timeChips}</div>` : ""}
<h2>Topics you'd like to discuss (pick 1–2)</h2>${topicChips}
<h2>Note for your mentor (optional)</h2><textarea rows="3" id="note" aria-label="Note">${appState.bookingNote}</textarea></div>
<div class="bar"><div class="mut" style="margin-bottom:6px">${summary}</div><button class="pri full" ${isReady ? "" : 'disabled style="opacity:.5"'} data-a="sendInvite">Send invite</button></div>`;
  },

  sent() {
    const mentor = getMentor(appState.mentorId);
    return `<div class="pad" style="padding-top:60px;text-align:center;max-width:560px;margin:0 auto"><div style="font-size:44px">✉️</div><div class="b" style="color:var(--ok);font-size:20px">✓ Invite sent</div><p>${appState.inviteAccepted ? `${mentor.name} accepted. You're all set.` : `We'll let you know when ${mentor.name} accepts.`}</p>
<div class="card" style="text-align:left"><div class="b">${formatDayLabel(upcomingDays[appState.selectedDayIndex])} · ${appState.selectedTime}</div><div class="mut">Video call · 30 min</div><div style="margin-top:6px">${appState.topics.map((topic) => `<span class="tag">${topic}</span>`).join("")}</div></div>
${appState.inviteAccepted ? "" : `<button class="sft full" style="margin-bottom:8px" data-a="acceptInvite">${mentor.name} accepts (demo)</button>`}<button class="pri full" style="margin-bottom:8px" data-a="startCall">Join session (demo)</button><button class="full" data-a="go" data-v="home">Back to home</button></div>`;
  },

  call() {
    const mentor = getMentor(appState.mentorId);
    const { consentLevel } = appState;
    const isTranscriptTab = appState.callTab === 1;

    let transcriptPanel;
    if (consentLevel === CONSENT.NONE) {
      transcriptPanel = `<p>Transcription is off. A transcript is only made if both you and ${mentor.name} agree. Either of you can stop it at any time. If sensitive topics come up, they're flagged to your parish coordinator for care and PDPA compliance.</p><button class="pri full" data-a="requestConsent">I agree — ask ${mentor.name}</button>`;
    } else if (consentLevel === CONSENT.WAITING_FOR_MENTOR) {
      transcriptPanel = `<p>Waiting for ${mentor.name} to agree…</p><div class="grid"><button class="pri" data-a="grantMentorConsent">${mentor.name} agrees (demo)</button><button data-a="cancelConsent">Cancel request</button></div>`;
    } else {
      transcriptPanel = `<p class="mut">[Live transcript placeholder for the hackathon]</p><p class="mut">Sensitive topics are flagged to your parish coordinator.</p><button class="full" data-a="cancelConsent">Stop transcript</button>`;
    }

    const tabContent = isTranscriptTab
      ? transcriptPanel
      : `<textarea id="notes" rows="6" aria-label="My notes" placeholder="Private notes, autosaved">${appState.sessionNotes}</textarea>`;

    return `<div class="call"><div class="hd"><div style="flex:1"><h1>Session with ${mentor.name}</h1><small>${appState.topics.join(", ")}</small></div><span class="pill" id="tm"></span></div>
${consentLevel === CONSENT.BOTH_AGREED ? '<div class="pill" style="margin:10px 16px 0;display:inline-block;color:#ff8a80">● Transcribing · both of you agreed</div>' : ""}
<div class="vid"><div>[Jitsi (JaaS) video placeholder]<br><small>Add JaaS keys to enable the live call</small></div><div class="me">You</div></div>
<div class="row" style="justify-content:center;margin-bottom:12px"><button id="mic" data-a="toggleMic" style="background:#2C3850;color:#fff;border:0">Mic on</button><button id="cam" data-a="toggleCamera" style="background:#2C3850;color:#fff;border:0">Camera on</button><button data-a="endSession" style="background:var(--bad);color:#fff;border:0">End session</button></div>
<div class="pad"><div class="card"><div class="sw"><button class="chip ${isTranscriptTab ? "" : "on"}" style="margin:0" data-a="selectCallTab" data-v="0">My notes</button><button class="chip ${isTranscriptTab ? "on" : ""}" style="margin:0" data-a="selectCallTab" data-v="1">Transcript</button></div>
${tabContent}</div></div></div>`;
  },

  take() {
    const mentor = getMentor(appState.mentorId);
    return `${renderHeader("Key takeaways", `${mentor.name} · ${formatDayLabel(upcomingDays[appState.selectedDayIndex])} · 30 min`, "home")}<div class="pad" style="margin-top:12px"><div class="card"><h3>Your notes</h3><p>${appState.sessionNotes || '<span class="mut">No notes taken.</span>'}</p></div><div class="card"><h3>Topics covered</h3>${appState.topics.map((topic) => `<span class="tag">${topic}</span>`).join("")}</div><div class="card"><h3>Transcript</h3><p class="mut">Only saved when both you and your mentor agreed to transcription during the call.${appState.hadTranscript ? " Placeholder transcript saved. Sensitive topics, if any, are flagged to your coordinator for follow-up." : ""}</p></div>
<button class="pri full" style="margin-bottom:8px" data-a="bookAgain">Book another session</button><button class="full" data-a="go" data-v="home">Done</button></div>`;
  },

  admin() {
    return `${renderHeader("Coordinator Dashboard", "Parish oversight and case management", "home")}<div class="pad"><div class="card"><h3>Session flagging</h3><p>Monitor flagged sessions and sensitive topics from mentee-mentor interactions.</p></div><div class="card"><h3>Account management</h3><p>Manage mentee and mentor accounts, parish assignments, and training progress.</p></div><div class="card"><h3>Reports</h3><p>View analytics on formation completion, session attendance, and engagement.</p></div><p class="mut" style="text-align:center;margin-top:20px;font-size:12px">This feature is coming soon.</p></div>`;
  },
};