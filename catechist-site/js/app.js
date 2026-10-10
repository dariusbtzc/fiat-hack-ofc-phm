// app.js — Router/renderer renderApp(), live search, toasts and the global click/change handlers (data-a actions).

// Which nav item to highlight on screens that show the side nav
const navHighlightByScreen = {
  journey: "journey",
  mprof: "mentors",
  book: "mentors",
  sent: "mentors",
  take: "mentors",
};

const formatTimeLeft = (totalSeconds) =>
  `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")} left`;

function renderApp() {
  const { screen } = appState;
  const app = querySelector("#app");

  clearInterval(appState.timerInterval);
  app.innerHTML = screenViews[screen]();

  if (navHighlightByScreen[screen]) {
    app.insertAdjacentHTML(
      "beforeend",
      renderNav(appState.accountType || "mentee", navHighlightByScreen[screen], true),
    );
  }
  app.className = querySelector("#app .side") ? "wn" : "";
  scrollTo(0, 0);

  if (screen === "find") {
    const searchInput = querySelector("#q");
    searchInput.oninput = () => {
      appState.searchQuery = searchInput.value;
      updateSearchResults();
    };
    updateSearchResults();
  }

  if (screen === "call") {
    const updateTimerDisplay = () => {
      const timerDisplay = querySelector("#tm");
      if (timerDisplay) timerDisplay.textContent = formatTimeLeft(appState.secondsLeft);
    };
    updateTimerDisplay();
    appState.timerInterval = setInterval(() => {
      appState.secondsLeft = Math.max(0, appState.secondsLeft - 1);
      updateTimerDisplay();
    }, 1000);

    const notesInput = querySelector("#notes");
    if (notesInput) notesInput.oninput = (event) => (appState.sessionNotes = event.target.value);
  }

  if (screen === "book") {
    querySelector("#note").oninput = (event) => (appState.bookingNote = event.target.value);
  }

  if (screen === "login") {
    const emailInput = querySelector("#loginEmail");
    const passwordInput = querySelector("#loginPassword");
    if (emailInput) emailInput.oninput = (event) => (appState.loginEmail = event.target.value);
    if (passwordInput) passwordInput.oninput = (event) => (appState.loginPassword = event.target.value);
  }

  if (screen === "register") {
    const nameInput = querySelector("#regName");
    const emailInput = querySelector("#regEmail");
    const passwordInput = querySelector("#regPassword");
    const accountTypeSelect = querySelector("#regAccountType");
    const parishSelect = querySelector("#regParish");
    const ageSelect = querySelector("#regAge");
    if (nameInput) nameInput.oninput = (event) => (appState.regName = event.target.value);
    if (emailInput) emailInput.oninput = (event) => (appState.regEmail = event.target.value);
    if (passwordInput) passwordInput.oninput = (event) => (appState.regPassword = event.target.value);
    if (accountTypeSelect) accountTypeSelect.onchange = (event) => (appState.regAccountType = event.target.value);
    if (parishSelect) parishSelect.onchange = (event) => (appState.regParish = event.target.value);
    if (ageSelect) ageSelect.onchange = (event) => (appState.regAge = event.target.value);
  }
}

function updateSearchResults() {
  const query = appState.searchQuery.toLowerCase();
  const results = menteeDirectory.filter(
    (mentee) =>
      mentee.name.toLowerCase().includes(query) || parishNames[mentee.parish].toLowerCase().includes(query),
  );

  querySelector("#res").innerHTML =
    `<div class="mut" style="margin:10px 0">${results.length} mentees found · They'll need to accept your request</div>` +
    results
      .map((mentee) => {
        const isFriend = appState.friends.has(mentee.id);
        const isRequested = appState.sentRequests.has(mentee.id);
        const buttonClass = isFriend ? "" : isRequested ? "sft" : "pri";
        const buttonLabel = isFriend ? "Friends" : isRequested ? "Requested" : "Add";
        return `<div class="card row">${renderAvatar(mentee.name)}<div class="g"><div class="b">${mentee.name}</div><div class="mut">${parishNames[mentee.parish]} · Year ${mentee.year}</div></div><button class="${buttonClass}" ${isFriend ? "disabled" : ""} data-a="toggleFriendRequest" data-v="${mentee.id}">${buttonLabel}</button></div>`;
      })
      .join("");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed;left:50%;top:calc(16px + env(safe-area-inset-top,0px));transform:translateX(-50%);background:var(--pri);color:var(--on);padding:10px 16px;border-radius:99px;z-index:20;font-weight:600;pointer-events:none";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

// <select> and checkbox actions
document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-a]");
  if (!target) return;

  const changeActions = {
    filterParish: () => {
      appState.parishFilter = target.value;
      renderApp();
    },
    filterAge: () => {
      appState.ageFilter = target.value;
      renderApp();
    },
    toggleCourseItem: () => {
      const itemKey = target.dataset.v;
      target.checked ? appState.completedItems.add(itemKey) : appState.completedItems.delete(itemKey);
      renderApp();
    },
  };
  changeActions[target.dataset.a]?.();
});

// Button actions
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-a]");
  if (!target || target.tagName === "SELECT" || target.type === "checkbox") return;

  const action = target.dataset.a;
  const value = target.dataset.v;

  const goToScreen = (screen) => {
    appState.screen = screen;
    renderApp();
  };

  const clickActions = {
    go: () => {
      if (value === "book") {
        appState.selectedDayIndex = null;
        appState.selectedTime = null;
      }
      goToScreen(value);
    },

    comingSoon: () => showToast("Coming soon"),

    // --- Auth ---
    login: () => {
      if (!appState.loginEmail || !appState.loginPassword) {
        showToast("Please enter email and password");
        return;
      }
      const result = AUTH.login(appState.loginEmail, appState.loginPassword);
      if (result.error) {
        showToast(result.error);
        return;
      }
      appState.userId = result.userId;
      appState.accountType = result.accountType;
      appState.sessionUser = result.user;
      appState.screen = "home";
      appState.loginEmail = "";
      appState.loginPassword = "";
      renderApp();
    },
    register: () => {
      if (!appState.regName || !appState.regEmail || !appState.regPassword) {
        showToast("Please fill in all fields");
        return;
      }
      const result = AUTH.register(appState.regEmail, appState.regPassword, appState.regName, appState.regAccountType, {
        parish: appState.regParish,
        age: appState.regAge,
      });
      if (result.error) {
        showToast(result.error);
        return;
      }
      appState.userId = result.userId;
      appState.accountType = result.accountType;
      appState.sessionUser = result.user;
      appState.regName = "";
      appState.regEmail = "";
      appState.regPassword = "";
      appState.regAccountType = "mentee";
      appState.regParish = "ig";
      appState.regAge = "20s";
      appState.screen = "home";
      renderApp();
      showToast("Account created!");
    },
    confirmLogout: () => {
      AUTH.logout();
      appState.userId = null;
      appState.accountType = null;
      appState.sessionUser = null;
      appState.screen = "login";
      renderApp();
      showToast("Logged out");
    },

    // --- Formation journey ---
    selectYear: () => {
      appState.journeyYear = +value;
      renderApp();
    },

    // --- Friends ---
    toggleFriendRequest: () => {
      const menteeId = +value;
      if (appState.sentRequests.has(menteeId)) {
        appState.sentRequests.delete(menteeId);
      } else {
        appState.sentRequests.add(menteeId);
        showToast("Request sent");
      }
      updateSearchResults();
    },
    acceptFriend: () => {
      const menteeId = +value;
      appState.incomingRequests = appState.incomingRequests.filter((id) => id !== menteeId);
      appState.friends.add(menteeId);
      renderApp();
    },
    declineFriend: () => {
      appState.incomingRequests = appState.incomingRequests.filter((id) => id !== +value);
      renderApp();
    },
    sendReaction: () => {
      const [menteeId, emoji] = value.split("|");
      appState.reactions[menteeId] = emoji;
      showToast("Sent " + emoji);
      renderApp();
    },

    // --- Library ---
    toggleLibraryCategory: () => {
      appState.openLibraryCategory = appState.openLibraryCategory === value ? null : value;
      renderApp();
    },

    // --- Finding and booking a mentor ---
    selectSkill: () => {
      appState.skillFilter = value;
      renderApp();
    },
    viewMentor: () => {
      appState.mentorId = +value;
      goToScreen("mprof");
    },
    selectDate: () => {
      appState.selectedDayIndex = +value;
      appState.selectedTime = null;
      renderApp();
    },
    selectTime: () => {
      appState.selectedTime = value;
      renderApp();
    },
    toggleTopic: () => {
      // Keep at most the 2 most recently picked topics
      appState.topics = appState.topics.includes(value)
        ? appState.topics.filter((topic) => topic !== value)
        : [...appState.topics, value].slice(-2);
      renderApp();
    },
    sendInvite: () => {
      appState.inviteAccepted = false;
      goToScreen("sent");
    },
    acceptInvite: () => {
      appState.inviteAccepted = true;
      renderApp();
    },

    // --- Live call ---
    startCall: () => {
      appState.secondsLeft = SESSION_SECONDS;
      appState.consentLevel = CONSENT.NONE;
      appState.callTab = 0;
      appState.sessionNotes = "";
      goToScreen("call");
    },
    toggleMic: () => {
      target.textContent = target.textContent === "Mic on" ? "Mic off" : "Mic on";
    },
    toggleCamera: () => {
      target.textContent = target.textContent === "Camera on" ? "Camera off" : "Camera on";
    },
    selectCallTab: () => {
      appState.callTab = +value;
      renderApp();
    },
    cancelConsent: () => {
      appState.consentLevel = CONSENT.NONE;
      renderApp();
    },
    requestConsent: () => {
      appState.consentLevel = CONSENT.WAITING_FOR_MENTOR;
      renderApp();
    },
    grantMentorConsent: () => {
      appState.consentLevel = CONSENT.BOTH_AGREED;
      appState.hadTranscript = true;
      renderApp();
    },
    endSession: () => {
      appState.sessionCount += 1;
      goToScreen("take");
    },
    bookAgain: () => {
      appState.selectedDayIndex = null;
      appState.selectedTime = null;
      appState.topics = [];
      appState.bookingNote = "";
      goToScreen("book");
    },
  };

  clickActions[action]?.();
});

// Initialize auth on page load
AUTH.initAuth();
const savedSession = AUTH.getSession();
if (savedSession) {
  appState.userId = savedSession.userId;
  appState.accountType = savedSession.accountType;
  appState.sessionUser = savedSession.user;
  appState.screen = "home";
} else {
  appState.screen = "login";
}
renderApp();
