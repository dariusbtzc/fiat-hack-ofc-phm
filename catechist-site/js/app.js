// app.js — Router/renderer R(), live search, toasts and the global click/change handlers (data-a actions).
function R() {
  clearInterval(S.iv);
  $("#app").innerHTML = V[S.scr]();
  const navigationMap = {
    journey: "profile",
    mprof: "mentors",
    book: "mentors",
    sent: "mentors",
    take: "mentors",
  };
  if (navigationMap[S.scr])
    $("#app").insertAdjacentHTML(
      "beforeend",
      nav(S.accountType || "mentee", navigationMap[S.scr]).replace("bar side", "bar side x"),
    );
  $("#app").className = $("#app .side") ? "wn" : "";
  scrollTo(0, 0);
  if (S.scr == "find") {
    const q = $("#q");
    q.oninput = () => {
      S.q = q.value;
      res();
    };
    res();
  }
  if (S.scr == "call") {
    const t = () => {
      const e = $("#tm");
      if (e)
        e.textContent = `${Math.floor(S.t / 60)}:${String(S.t % 60).padStart(2, "0")} left`;
    };
    t();
    S.iv = setInterval(() => {
      S.t = Math.max(0, S.t - 1);
      t();
    }, 1e3);
  }
  if (S.scr == "book") {
    $("#note").oninput = (e) => (S.note = e.target.value);
  }
  if (S.scr == "call" && $("#notes"))
    $("#notes").oninput = (e) => (S.notes = e.target.value);
  if (S.scr == "login") {
    const loginEmail = $("#loginEmail");
    const loginPassword = $("#loginPassword");
    if (loginEmail) loginEmail.oninput = (e) => (S.loginEmail = e.target.value);
    if (loginPassword) loginPassword.oninput = (e) => (S.loginPassword = e.target.value);
  }
  if (S.scr == "register") {
    const regName = $("#regName");
    const regEmail = $("#regEmail");
    const regPassword = $("#regPassword");
    const regAccountType = $("#regAccountType");
    const regParish = $("#regParish");
    const regAge = $("#regAge");
    if (regName) regName.oninput = (e) => (S.regName = e.target.value);
    if (regEmail) regEmail.oninput = (e) => (S.regEmail = e.target.value);
    if (regPassword) regPassword.oninput = (e) => (S.regPassword = e.target.value);
    if (regAccountType) regAccountType.onchange = (e) => (S.regAccountType = e.target.value);
    if (regParish) regParish.onchange = (e) => (S.regParish = e.target.value);
    if (regAge) regAge.onchange = (e) => (S.regAge = e.target.value);
  }
}
function res() {
  const query = S.q.toLowerCase(),
    results = menteesN.filter(
      (mentee) =>
        mentee[1].toLowerCase().includes(query) || ParishName[mentee[2]].toLowerCase().includes(query),
    );
  $("#res").innerHTML =
    `<div class="mut" style="margin:10px 0">${results.length} mentees found · They'll need to accept your request</div>` +
    results
      .map((mentee) => {
        const isFriend = S.fr.has(mentee[0]),
          isRequested = S.req.has(mentee[0]);
        return `<div class="card row">${av(mentee[1])}<div class="g"><div class="b">${mentee[1]}</div><div class="mut">${ParishName[mentee[2]]} · Year ${mentee[3]}</div></div><button class="${isFriend ? "" : isRequested ? "sft" : "pri"}" ${isFriend ? "disabled" : ""} data-a="add" data-v="${mentee[0]}">${isFriend ? "Friends" : isRequested ? "Requested" : "Add"}</button></div>`;
      })
      .join("");
}
function toast(message) {
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
    S.pf = target.value;
    R();
  }
  if (target.dataset.a == "af") {
    S.af = target.value;
    R();
  }
  if (target.dataset.a == "chk") {
    const key = target.dataset.v;
    target.checked ? S.done.add(key) : S.done.delete(key);
    R();
  }
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-a]");
  if (!target || target.tagName == "SELECT" || target.type == "checkbox") return;
  const action = target.dataset.a,
    value = target.dataset.v;
  const go = (screen) => {
    S.scr = screen;
    R();
  };
  ({
    go: () => {
      if (value == "book") {
        S.date = null;
        S.time = null;
      }
      go(value);
    },
    loginBtn: () => {
      if (!S.loginEmail || !S.loginPassword) {
        toast("Please enter email and password");
        return;
      }
      const result = AUTH.login(S.loginEmail, S.loginPassword);
      if (result.error) {
        toast(result.error);
      } else {
        S.userId = result.userId;
        S.accountType = result.accountType;
        S.sessionUser = result.user;
        S.scr = "profile";
        S.loginEmail = "";
        S.loginPassword = "";
        R();
      }
    },
    registerBtn: () => {
      if (!S.regName || !S.regEmail || !S.regPassword) {
        toast("Please fill in all fields");
        return;
      }
      const result = AUTH.register(S.regEmail, S.regPassword, S.regName, S.regAccountType, {
        parish: S.regParish,
        age: S.regAge,
      });
      if (result.error) {
        toast(result.error);
      } else {
        S.userId = result.userId;
        S.accountType = result.accountType;
        S.sessionUser = result.user;
        S.regName = "";
        S.regEmail = "";
        S.regPassword = "";
        S.regAccountType = "mentee";
        S.regParish = "ig";
        S.regAge = "20s";
        S.scr = "profile";
        R();
        toast("Account created!");
      }
    },
    confirmLogout: () => {
      AUTH.logout();
      S.userId = null;
      S.accountType = null;
      S.sessionUser = null;
      S.scr = "login";
      R();
      toast("Logged out");
    },
    tab: () => {
      S.tab = +value;
      R();
    },
    add: () => {
      const id = +value;
      S.req.has(id) ? S.req.delete(id) : (S.req.add(id), toast("Request sent"));
      res();
    },
    acc: () => {
      const id = +value;
      S.inc = S.inc.filter((x) => x != id);
      S.fr.add(id);
      R();
    },
    dec: () => {
      S.inc = S.inc.filter((x) => x != +value);
      R();
    },
    rx: () => {
      const [i, em] = value.split("|");
      S.rx[i] = em;
      toast("Sent " + em);
      R();
    },
    lib: () => {
      S.lib = S.lib == value ? null : value;
      R();
    },
    sf: () => {
      S.sf = value;
      R();
    },
    mp: () => {
      S.mid = +value;
      go("mprof");
    },
    date: () => {
      S.date = +value;
      S.time = null;
      R();
    },
    time: () => {
      S.time = value;
      R();
    },
    top: () => {
      S.topics = S.topics.includes(value)
        ? S.topics.filter((x) => x != value)
        : [...S.topics, value].slice(-2);
      R();
    },
    send: () => {
      S.acc = false;
      go("sent");
    },
    accept: () => {
      S.acc = true;
      R();
    },
    call: () => {
      S.t = 1800;
      S.cons = 0;
      S.ct = 0;
      S.notes = "";
      go("call");
    },
    mic: () => {
      target.textContent = target.textContent == "Mic on" ? "Mic off" : "Mic on";
    },
    cam: () => {
      target.textContent = target.textContent == "Camera on" ? "Camera off" : "Camera on";
    },
    ct: () => {
      S.ct = +value;
      R();
    },
    c0: () => {
      S.cons = 0;
      R();
    },
    c1: () => {
      S.cons = 1;
      R();
    },
    c2: () => {
      S.cons = 2;
      S.hadTr = true;
      R();
    },
    end: () => {
      S.sessions = (S.sessions || 0) + 1;
      go("take");
    },
    again: () => {
      S.date = null;
      S.time = null;
      S.topics = [];
      S.note = "";
      go("book");
    },
  })[action]?.();
});

// Initialize auth on page load
AUTH.initAuth();
const sess = AUTH.getSession();
if (sess) {
  S.userId = sess.userId;
  S.accountType = sess.accountType;
  S.sessionUser = sess.user;
  S.scr = "profile";
} else {
  S.scr = "login";
}
R();
