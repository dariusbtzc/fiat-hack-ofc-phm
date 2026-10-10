// app.js — Router/renderer R(), live search, toasts and the global click/change handlers (data-a actions).
function R() {
  clearInterval(S.iv);
  $("#app").innerHTML = V[S.scr]();
  const NA = {
    journey: "profile",
    mprof: "mentors",
    book: "mentors",
    sent: "mentors",
    take: "mentors",
  };
  if (NA[S.scr])
    $("#app").insertAdjacentHTML(
      "beforeend",
      nav(S.accountType || "mentee", NA[S.scr]).replace("bar side", "bar side x"),
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
  const q = S.q.toLowerCase(),
    l = menteesN.filter(
      (m) =>
        m[1].toLowerCase().includes(q) || ParishName[m[2]].toLowerCase().includes(q),
    );
  $("#res").innerHTML =
    `<div class="mut" style="margin:10px 0">${l.length} mentees found · They'll need to accept your request</div>` +
    l
      .map((m) => {
        const f = S.fr.has(m[0]),
          r = S.req.has(m[0]);
        return `<div class="card row">${av(m[1])}<div class="g"><div class="b">${m[1]}</div><div class="mut">${ParishName[m[2]]} · Year ${m[3]}</div></div><button class="${f ? "" : r ? "sft" : "pri"}" ${f ? "disabled" : ""} data-a="add" data-v="${m[0]}">${f ? "Friends" : r ? "Requested" : "Add"}</button></div>`;
      })
      .join("");
}
function toast(t) {
  const e = document.createElement("div");
  e.textContent = t;
  e.style.cssText =
    "position:fixed;left:50%;top:calc(16px + env(safe-area-inset-top,0px));transform:translateX(-50%);background:var(--pri);color:var(--on);padding:10px 16px;border-radius:99px;z-index:20;font-weight:600;pointer-events:none";
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 1800);
}
document.addEventListener("change", (e) => {
  const t = e.target.closest("[data-a]");
  if (!t) return;
  if (t.dataset.a == "pf") {
    S.pf = t.value;
    R();
  }
  if (t.dataset.a == "af") {
    S.af = t.value;
    R();
  }
  if (t.dataset.a == "chk") {
    const k = t.dataset.v;
    t.checked ? S.done.add(k) : S.done.delete(k);
    R();
  }
});
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-a]");
  if (!t || t.tagName == "SELECT" || t.type == "checkbox") return;
  const a = t.dataset.a,
    v = t.dataset.v;
  const go = (s) => {
    S.scr = s;
    R();
  };
  ({
    go: () => {
      if (v == "book") {
        S.date = null;
        S.time = null;
      }
      go(v);
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
      S.tab = +v;
      R();
    },
    add: () => {
      const id = +v;
      S.req.has(id) ? S.req.delete(id) : (S.req.add(id), toast("Request sent"));
      res();
    },
    acc: () => {
      const id = +v;
      S.inc = S.inc.filter((x) => x != id);
      S.fr.add(id);
      R();
    },
    dec: () => {
      S.inc = S.inc.filter((x) => x != +v);
      R();
    },
    rx: () => {
      const [i, em] = v.split("|");
      S.rx[i] = em;
      toast("Sent " + em);
      R();
    },
    lib: () => {
      S.lib = S.lib == v ? null : v;
      R();
    },
    sf: () => {
      S.sf = v;
      R();
    },
    mp: () => {
      S.mid = +v;
      go("mprof");
    },
    date: () => {
      S.date = +v;
      S.time = null;
      R();
    },
    time: () => {
      S.time = v;
      R();
    },
    top: () => {
      S.topics = S.topics.includes(v)
        ? S.topics.filter((x) => x != v)
        : [...S.topics, v].slice(-2);
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
      t.textContent = t.textContent == "Mic on" ? "Mic off" : "Mic on";
    },
    cam: () => {
      t.textContent = t.textContent == "Camera on" ? "Camera off" : "Camera on";
    },
    ct: () => {
      S.ct = +v;
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
  })[a]?.();
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
