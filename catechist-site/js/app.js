// app.js — Router/renderer renderApp(), live search, toasts and the global click/change handlers (data-a actions).
function renderApp() {
  clearInterval(appState.iv);
  querySelector("#app").innerHTML = screenViews[appState.scr]();
  const navigationMap = {
    journey: "profile",
    mprof: "mentors",
    book: "mentors",
    sent: "mentors",
    take: "mentors",
  };
  if (navigationMap[appState.scr])
    querySelector("#app").insertAdjacentHTML(
      "beforeend",
      nav(appState.accountType || "mentee", navigationMap[appState.scr]).replace("bar side", "bar side x"),
    );
  querySelector("#app").className = querySelector("#app .side") ? "wn" : "";
  scrollTo(0, 0);
  if (appState.scr == "find") {
    const searchInput = querySelector("#q");
    searchInput.oninput = () => {
      appState.q = searchInput.value;
      updateSearchResults();
    };
    updateSearchResults();
  }
  if (appState.scr == "call") {
    const updateTimer = () => {
      const timerDisplay = querySelector("#tm");
      if (timerDisplay)
        timerDisplay.textContent = `${Math.floor(appState.t / 60)}:${String(appState.t % 60).padStart(2, "0")} left`;
    };
    updateTimer();
    appState.iv = setInterval(() => {
      appState.t = Math.max(0, appState.t - 1);
      updateTimer();
    }, 1e3);
  }
  if (appState.scr == "book") {
    querySelector("#note").oninput = (event) => (appState.note = event.target.value);
  }
  if (appState.scr == "call" && querySelector("#notes"))
    querySelector("#notes").oninput = (event) => (appState.notes = event.target.value);
  if (appState.scr == "login") {
    const loginEmail = querySelector("#loginEmail");
    const loginPassword = querySelector("#loginPassword");
    if (loginEmail) loginEmail.oninput = (event) => (appState.loginEmail = event.target.value);
    if (loginPassword) loginPassword.oninput = (event) => (appState.loginPassword = event.target.value);
  }
  if (appState.scr == "register") {
    const regName = querySelector("#regName");
    const regEmail = querySelector("#regEmail");
    const regPassword = querySelector("#regPassword");
    const regAccountType = querySelector("#regAccountType");
    const regParish = querySelector("#regParish");
    const regAge = querySelector("#regAge");
    if (regName) regName.oninput = (event) => (appState.regName = event.target.value);
    if (regEmail) regEmail.oninput = (event) => (appState.regEmail = event.target.value);
    if (regPassword) regPassword.oninput = (event) => (appState.regPassword = event.target.value);
    if (regAccountType) regAccountType.onchange = (event) => (appState.regAccountType = event.target.value);
    if (regParish) regParish.onchange = (event) => (appState.regParish = event.target.value);
    if (regAge) regAge.onchange = (event) => (appState.regAge = event.target.value);
  }
}
function updateSearchResults() {
  const query = appState.q.toLowerCase(),
    results = menteesN.filter(
      (mentee) =>
        mentee[1].toLowerCase().includes(query) || ParishName[mentee[2]].toLowerCase().includes(query),
    );
  querySelector("#res").innerHTML =
    `<div class="mut" style="margin:10px 0">${results.length} mentees found · They'll need to accept your request</div>` +
    results
      .map((mentee) => {
        const isFriend = appState.fr.has(mentee[0]),
          isRequested = appState.req.has(mentee[0]);
        return `<div class="card row">${renderAvatar(mentee[1])}<div class="g"><div class="b">${mentee[1]}</div><div class="mut">${ParishName[mentee[2]]} · Year ${mentee[3]}</div></div><button class="${isFriend ? "" : isRequested ? "sft" : "pri"}" ${isFriend ? "disabled" : ""} data-a="add" data-v="${mentee[0]}">${isFriend ? "Friends" : isRequested ? "Requested" : "Add"}</button></div>`;
      })
      .join("");
}
function showToast(message) {
  const element = document.createElement("div");
  element.textContent = message;
  element.style.cssText =
    "position:fixed;left:50%;top:calc(16px + env(safe-area-inset-top,0px));transform:translateX(-50%);background:var(--pri);color:var(--on);padding:10px 16px;border-radius:99px;z-index:20;font-weight:600;pointer-events:none";
  document.body.appendChild(element);
  setTimeout(() => element.remove(), 1800);
}
document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-a]");
  if (!target) return;
  if (target.dataset.a == "pf") {
    appState.pf = target.value;
    renderApp();
  }
  if (target.dataset.a == "af") {
    appState.af = target.value;
    renderApp();
  }
  if (target.dataset.a == "chk") {
    const key = target.dataset.v;
    target.checked ? appState.done.add(key) : appState.done.delete(key);
    renderApp();
  }
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-a]");
  if (!target || target.tagName == "SELECT" || target.type == "checkbox") return;
  const action = target.dataset.a,
    value = target.dataset.v;
  const go = (screen) => {
    appState.scr = screen;
    renderApp();
  };
  ({
    go: () => {
      if (value == "book") {
        appState.date = null;
        appState.time = null;
      }
      go(value);
    },
    loginBtn: () => {
      if (!appState.loginEmail || !appState.loginPassword) {
        showToast("Please enter email and password");
        return;
      }
      const result = AUTH.login(appState.loginEmail, appState.loginPassword);
      if (result.error) {
        showToast(result.error);
      } else {
        appState.userId = result.userId;
        appState.accountType = result.accountType;
        appState.sessionUser = result.user;
        appState.scr = "profile";
        appState.loginEmail = "";
        appState.loginPassword = "";
        renderApp();
      }
    },
    registerBtn: () => {
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
      } else {
        appState.userId = result.userId;
        appState.accountType = result.accountType;
        appState.sessionUser = result.user;
        appState.regName = "";
        appState.regEmail = "";
        appState.regPassword = "";
        appState.regAccountType = "mentee";
        appState.regParish = "ig";
        appState.regAge = "20s";
        appState.scr = "profile";
        renderApp();
        showToast("Account created!");
      }
    },
    confirmLogout: () => {
      AUTH.logout();
      appState.userId = null;
      appState.accountType = null;
      appState.sessionUser = null;
      appState.scr = "login";
      renderApp();
      showToast("Logged out");
    },
    tab: () => {
      appState.tab = +value;
      renderApp();
    },
    add: () => {
      const id = +value;
      appState.req.has(id) ? appState.req.delete(id) : (appState.req.add(id), showToast("Request sent"));
      updateSearchResults();
    },
    acc: () => {
      const id = +value;
      appState.inc = appState.inc.filter((x) => x != id);
      appState.fr.add(id);
      renderApp();
    },
    dec: () => {
      appState.inc = appState.inc.filter((x) => x != +value);
      renderApp();
    },
    rx: () => {
      const [index, emoji] = value.split("|");
      appState.rx[index] = emoji;
      showToast("Sent " + emoji);
      renderApp();
    },
    lib: () => {
      appState.lib = appState.lib == value ? null : value;
      renderApp();
    },
    sf: () => {
      appState.sf = value;
      renderApp();
    },
    mp: () => {
      appState.mid = +value;
      go("mprof");
    },
    date: () => {
      appState.date = +value;
      appState.time = null;
      renderApp();
    },
    time: () => {
      appState.time = value;
      renderApp();
    },
    top: () => {
      appState.topics = appState.topics.includes(value)
        ? appState.topics.filter((x) => x != value)
        : [...appState.topics, value].slice(-2);
      renderApp();
    },
    send: () => {
      appState.acc = false;
      go("sent");
    },
    accept: () => {
      appState.acc = true;
      renderApp();
    },
    call: () => {
      appState.t = 1800;
      appState.cons = 0;
      appState.ct = 0;
      appState.notes = "";
      go("call");
    },
    mic: () => {
      target.textContent = target.textContent == "Mic on" ? "Mic off" : "Mic on";
    },
    cam: () => {
      target.textContent = target.textContent == "Camera on" ? "Camera off" : "Camera on";
    },
    ct: () => {
      appState.ct = +value;
      renderApp();
    },
    c0: () => {
      appState.cons = 0;
      renderApp();
    },
    c1: () => {
      appState.cons = 1;
      renderApp();
    },
    c2: () => {
      appState.cons = 2;
      appState.hadTr = true;
      renderApp();
    },
    end: () => {
      appState.sessions = (appState.sessions || 0) + 1;
      go("take");
    },
    again: () => {
      appState.date = null;
      appState.time = null;
      appState.topics = [];
      appState.note = "";
      go("book");
    },
  })[action]?.();
});

// Initialize auth on page load
AUTH.initAuth();
const sess = AUTH.getSession();
if (sess) {
  appState.userId = sess.userId;
  appState.accountType = sess.accountType;
  appState.sessionUser = sess.user;
  appState.scr = "profile";
} else {
  appState.scr = "login";
}
renderApp();
