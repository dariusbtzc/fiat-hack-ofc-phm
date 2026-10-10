// views.js — One render function per screen (profile, journey, find, friends, library, mentors, mprof, book, sent, call, take).
const screenViews = {
  login() {
    return `<div class="pad" style="padding-top:60px;text-align:center;max-width:560px;margin:0 auto">
<div style="font-size:44px">✝️</div>
<h1 style="margin-top:16px">Catechist Support</h1>
<p class="mut">Mentoring & growth for catechists</p>
<div class="card" style="text-align:left;margin-top:32px">
<h2 style="margin-top:0">Login</h2>
<input type="email" id="loginEmail" placeholder="Email" aria-label="Email" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${S.loginEmail}">
<input type="password" id="loginPassword" placeholder="Password" aria-label="Password" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${S.loginPassword}">
<button class="pri full" data-a="loginBtn">Login</button>
<button class="full" style="margin-top:6px" data-a="go" data-v="register">Create an account</button>
</div>
<p class="mut" style="margin-top:16px;font-size:12px">Demo: joanna.tan@example.com / password123</p>
</div>`;
  },
  register() {
    return `<div class="pad" style="padding-top:40px;text-align:center;max-width:560px;margin:0 auto">
<h1>Create Account</h1>
<div class="card" style="text-align:left">
<input type="text" id="regName" placeholder="Name" aria-label="Name" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${S.regName}">
<input type="email" id="regEmail" placeholder="Email" aria-label="Email" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${S.regEmail}">
<input type="password" id="regPassword" placeholder="Password (min 6 chars)" aria-label="Password" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px" value="${S.regPassword}">
<select id="regAccountType" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="mentee" ${S.regAccountType === "mentee" ? "selected" : ""}>Mentee (trainee catechist)</option>
<option value="mentor" ${S.regAccountType === "mentor" ? "selected" : ""}>Mentor (experienced catechist)</option>
</select>
<select id="regParish" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="ig" ${S.regParish === "ig" ? "selected" : ""}>St Ignatius</option>
<option value="hs" ${S.regParish === "hs" ? "selected" : ""}>Holy Spirit</option>
<option value="rc" ${S.regParish === "rc" ? "selected" : ""}>Risen Christ</option>
<option value="gs" ${S.regParish === "gs" ? "selected" : ""}>Good Shepherd</option>
</select>
<select id="regAge" style="width:100%;margin-bottom:8px;padding:10px;border:1px solid var(--bor);border-radius:8px;font-family:inherit;font-size:16px">
<option value="20s" ${S.regAge === "20s" ? "selected" : ""}>20s</option>
<option value="30s" ${S.regAge === "30s" ? "selected" : ""}>30s</option>
<option value="40s" ${S.regAge === "40s" ? "selected" : ""}>40s</option>
<option value="50s+" ${S.regAge === "50s+" ? "selected" : ""}>50s+</option>
</select>
<button class="pri full" data-a="registerBtn">Create Account</button>
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
  profile() {
    const user = getCurrUser() || mentees;
    return `<div class="ban"></div><div class="pad" style="margin-top:-44px"><div class="card" style="padding-top:0"><div style="display:flex;justify-content:space-between;align-items:flex-end">${av(user.name, "l")}<button class="tag gold" style="border:0;min-height:44px" data-a="go" data-v="journey">Year ${user.yr || 1} ›</button></div>
<h1 style="margin-top:8px">${user.name}</h1><div class="mut" style="margin:2px 0 8px">${ParishName[user.p]}</div><span class="tag sft" style="background:var(--soft);color:var(--pri)">${S.accountType === "mentor" ? "Mentor" : "Mentee"}</span><span class="tag">${user.age}</span><span class="tag">Catechist</span>
<div class="row" style="margin-top:10px"><button class="g" style="border:0;text-align:left;background:none;padding:0" data-a="go" data-v="friends"><span class="b" style="font-size:18px">${S.fr.size}</span> <span class="mut">friends</span></button><div class="g"><span class="b" style="font-size:18px">${S.sessions || 0}</span> <span class="mut">mentor sessions</span></div></div></div>
<div class="card row"><div class="av" style="background:var(--gold);color:var(--goldt)">★</div><div><div class="b">1 year of service</div><div class="mut">Thank you for your ministry, ${user.name}.</div></div></div><h2>Grow</h2><div class="grid"><button class="pri" style="padding:16px;text-align:left;border-radius:14px" data-a="go" data-v="find">Add mentee friends</button><button class="pri" style="padding:16px;text-align:left;border-radius:14px" data-a="go" data-v="mentors">Get in touch with a mentor</button></div>
<button class="full card" style="margin-top:10px;text-align:left" data-a="go" data-v="library">Library <span class="tag" style="margin-left:6px">Nice-to-have</span></button>
<h2>Updates / Forum <span class="tag">Nice-to-have</span></h2><div class="card"><div class="b">How do you keep Year 1 classes engaged?</div><div class="mut">Grace Ong · St Ignatius · 4 replies</div></div>
<h2>Events</h2><div class="card row"><div class="av gold" style="background:var(--gold);color:var(--goldt);border-radius:10px;font-size:12px;text-align:center">17<br>Oct</div><div><div class="b">Day of Recollection</div><div class="mut">Cathedral of the Good Shepherd · 9:00 AM</div></div></div></div>${nav(S.accountType || "mentee", "profile")}`;
  },
  journey() {
    const year = S.tab,
      courses = formationCourses[year];
    return `${hd("My formation journey", "Formation courses by the Office for Catechesis")}<div class="pad" style="margin-top:12px"><div class="sw">${[1, 2, 3, 4].map((yearNum) => `<button class="chip ${yearNum == year ? "on" : ""}" style="flex:1;margin:0;padding:0" data-a="tab" data-v="${yearNum}">Year ${yearNum}${yearNum == 4 ? "+" : ""}</button>`).join("")}</div>
<div class="card pri" style="background:var(--pri);color:var(--on)"><div class="b" style="color:inherit">${year == (getCurrUser()?.yr || mentees.yr) ? `You're in Year ${year}` : `Year ${year}`}</div>${reqDone(year)} of ${req(year)} required items done</div>
${courses.map(([title, requirement, items]) => `<div class="card"><div class="row"><h3 class="g">${title}</h3><span class="tag ${requirement == "Required" ? "gold" : ""}">${requirement}</span></div>${items.map((item) => `<label class="row" style="min-height:44px"><input type="checkbox" data-a="chk" data-v="${year + item}" ${S.done.has(year + item) ? "checked" : ""} style="width:20px;height:20px"> ${item}</label>`).join("")}</div>`).join("")}</div>`;
  },
  find() {
    return `${hd("Find mentee friends")}<div class="pad" style="margin-top:12px"><input type="search" id="q" placeholder="Search by name or parish" aria-label="Search by name or parish" value="${S.q}"><div id="res"></div></div>${nav(S.accountType || "mentee", "friends")}`;
  },
  friends() {
    const friendsList = menteesN.filter((mentee) => S.fr.has(mentee[0]));
    return `${hd("Friends", "Send a quick word of encouragement", "profile", `<button class="sft" data-a="go" data-v="find">Add</button>`)}<div class="pad">
${
  S.inc.length
    ? `<h2>Friend requests (${S.inc.length})</h2>${S.inc
        .map((id) => {
          const mentee = mn(id);
          return `<div class="card"><div class="row">${av(mentee[1])}<div class="g"><div class="b">${mentee[1]}</div><div class="mut">${ParishName[mentee[2]]} · Year ${mentee[3]}</div></div></div><div class="grid" style="margin-top:10px"><button class="pri" data-a="acc" data-v="${id}">Accept</button><button data-a="dec" data-v="${id}">Decline</button></div></div>`;
        })
        .join("")}`
    : ""
}
<h2>My friends (${friendsList.length})</h2>${friendsList
      .map((mentee) => {
        const response = S.rx[mentee[0]];
        return `<div class="card row">${av(mentee[1])}<div class="g"><div class="b">${mentee[1]}</div><div class="mut">${response ? "You sent " + response : ParishName[mentee[2]]}</div></div>${["🙏", "❤️"].map((emoji) => `<button class="em ${response == emoji ? "on" : ""}" aria-label="Send ${emoji == "🙏" ? "praying hands" : "a heart"} to ${mentee[1]}" data-a="rx" data-v="${mentee[0]}|${emoji}">${emoji}</button>`).join("")}</div>`;
      })
      .join("")}</div>${nav(S.accountType || "mentee", "friends")}`;
  },
  library() {
    return `${hd("Library", "", "profile", '<span class="tag">Nice-to-have</span>')}<div class="pad" style="margin-top:12px"><input type="search" placeholder="Search resources" aria-label="Search resources" style="margin-bottom:10px">${libraryCategories.map((t) => `<button class="full card" style="text-align:left;min-height:0" data-a="lib" data-v="${t}"><span class="b">${t}</span>${S.lib == t ? '<div class="mut" style="margin-top:8px;font-weight:400">[Resources to be added: articles, lesson plans, videos]</div>' : ""}</button>`).join("")}</div>${nav(S.accountType || "mentee", "library")}`;
  },
  mentors() {
    const user = getCurrUser() || mentees;
    const mentorsList = mentors.filter(
      (mentor) =>
        (!S.pf || mentor[2] == S.pf) &&
        (!S.af || mentor[3] == S.af) &&
        (!S.sf || mentor[5].includes(S.sf)),
    ).sort((a, b) => (b[2] == user.p) - (a[2] == user.p));
    return `${hd("Find a mentor")}<div class="pad" style="margin-top:12px"><div class="grid"><select aria-label="Parish" data-a="pf"><option value="">All parishes</option>${Object.entries(
      ParishName,
    )
      .map(
        ([k, v]) =>
          `<option value="${k}" ${S.pf == k ? "selected" : ""}>${v}</option>`,
      )
      .join(
        "",
      )}</select><select aria-label="Age" data-a="af"><option value="">Any age</option>${["20s", "30s", "40s", "50s+"].map((age) => `<option ${S.af == age ? "selected" : ""}>${age}</option>`).join("")}</select></div>
<div style="margin:10px 0;overflow-x:auto;white-space:nowrap">${["", ...skills].map((skill) => `<button class="chip ${S.sf == skill ? "on" : ""}" data-a="sf" data-v="${skill}">${skill || "All"}</button>`).join("")}</div><div class="mut" style="margin-bottom:8px">${mentorsList.length} mentors match</div>
<div class="grid g3">${mentorsList.map((mentor) => `<div class="card" style="text-align:center">${av(mentor[1]).replace("av", 'av" style="margin:0 auto 6px;"').replace('"" style', '" style')}<div class="b">${mentor[1]}</div><div class="mut">${ParishName[mentor[2]]}<br>${mentor[3]} · ${mentor[4]} yrs serving</div>${mentor[2] == user.p ? '<span class="tag" style="background:var(--soft);color:var(--pri)">Your parish</span> ' : ""}<span class="tag gold" style="margin-top:6px">${mentor[5][0]}</span><button class="sft full" style="margin-top:6px" data-a="mp" data-v="${mentor[0]}">View profile</button></div>`).join("")}</div></div>${nav(S.accountType || "mentee", "mentors")}`;
  },
  mprof() {
    const mentor = mt(S.mid);
    return `<div class="ban" style="height:110px"></div><div class="mb" style="position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:10px"><button class="back" aria-label="Back" data-a="go" data-v="mentors">‹</button></div><div class="pad" style="margin-top:-36px">${av(mentor[1], "l")}<h1 style="margin-top:8px">${mentor[1]}</h1><div class="mut">${ParishName[mentor[2]]}</div><div style="margin-top:8px"><span class="tag gold">Mentor</span><span class="tag">${mentor[3]}</span><span class="tag">${mentor[4]} yrs serving</span></div>
<h2>About</h2><p>[Mentor bio] ${mentor[1]} has served as a catechist for ${mentor[4]} years and enjoys walking with newer catechists.</p><h2>Specialisation</h2>${mentor[5].map((skill) => `<span class="tag gold">${skill}</span>`).join("")}
<div class="card" style="margin-top:14px"><div class="b">30-minute video sessions</div><div class="mut">Usually available weekday evenings</div></div></div><div class="bar"><button class="pri full" data-a="go" data-v="book">Book a session</button></div>`;
  },
  book() {
    const mentor = mt(S.mid),
      isReady = S.date != null && S.time && S.topics.length;
    return `${hd("Book a session", `with ${mentor[1]} · 30 min video call`, "mprof")}<div class="pad"><h2>Choose a date</h2><div style="overflow-x:auto;white-space:nowrap">${days.map((date, index) => `<button class="chip ${S.date === index ? "on" : ""}" data-a="date" data-v="${index}">${dl(date)}</button>`).join("")}</div>
${S.date != null ? `<h2>Choose a time</h2><div class="grid">${times.map((time, index) => (booked(mentor[0], S.date, index) ? "" : `<button class="chip ${S.time == time ? "on" : ""}" style="margin:0" data-a="time" data-v="${time}">${time}</button>`)).join("")}</div>` : ""}
<h2>Topics you'd like to discuss (pick 1–2)</h2>${topics.map((topic) => `<button class="chip ${S.topics.includes(topic) ? "on" : ""}" data-a="top" data-v="${topic}">${topic}</button>`).join("")}
<h2>Note for your mentor (optional)</h2><textarea rows="3" id="note" aria-label="Note">${S.note}</textarea></div>
<div class="bar"><div class="mut" style="margin-bottom:6px">${isReady ? `${dl(days[S.date])} · ${S.time} · ${S.topics.length} topic${S.topics.length > 1 ? "s" : ""}` : "Pick a date, time and at least one topic"}</div><button class="pri full" ${isReady ? "" : 'disabled style="opacity:.5"'} data-a="send">Send invite</button></div>`;
  },
  sent() {
    const mentor = mt(S.mid);
    return `<div class="pad" style="padding-top:60px;text-align:center;max-width:560px;margin:0 auto"><div style="font-size:44px">✉️</div><div class="b" style="color:var(--ok);font-size:20px">✓ Invite sent</div><p>${S.acc ? `${mentor[1]} accepted. You're all set.` : `We'll let you know when ${mentor[1]} accepts.`}</p>
<div class="card" style="text-align:left"><div class="b">${dl(days[S.date])} · ${S.time}</div><div class="mut">Video call · 30 min</div><div style="margin-top:6px">${S.topics.map((topic) => `<span class="tag">${topic}</span>`).join("")}</div></div>
${S.acc ? "" : `<button class="sft full" style="margin-bottom:8px" data-a="accept">${mentor[1]} accepts (demo)</button>`}<button class="pri full" style="margin-bottom:8px" data-a="call">Join session (demo)</button><button class="full" data-a="go" data-v="profile">Back to profile</button></div>`;
  },
  call() {
    const mentor = mt(S.mid),
      consentLevel = S.cons;
    return `<div class="call"><div class="hd"><div style="flex:1"><h1>Session with ${mentor[1]}</h1><small>${S.topics.join(", ")}</small></div><span class="pill" id="tm"></span></div>
${consentLevel == 2 ? '<div class="pill" style="margin:10px 16px 0;display:inline-block;color:#ff8a80">● Transcribing · both of you agreed</div>' : ""}
<div class="vid"><div>[Jitsi (JaaS) video placeholder]<br><small>Add JaaS keys to enable the live call</small></div><div class="me">You</div></div>
<div class="row" style="justify-content:center;margin-bottom:12px"><button id="mic" data-a="mic" style="background:#2C3850;color:#fff;border:0">Mic on</button><button id="cam" data-a="cam" style="background:#2C3850;color:#fff;border:0">Camera on</button><button data-a="end" style="background:var(--bad);color:#fff;border:0">End session</button></div>
<div class="pad"><div class="card"><div class="sw"><button class="chip ${S.ct != 1 ? "on" : ""}" style="margin:0" data-a="ct" data-v="0">My notes</button><button class="chip ${S.ct == 1 ? "on" : ""}" style="margin:0" data-a="ct" data-v="1">Transcript</button></div>
${S.ct == 1 ? (consentLevel == 0 ? `<p>Transcription is off. A transcript is only made if both you and ${mentor[1]} agree. Either of you can stop it at any time. If sensitive topics come up, they're flagged to your parish coordinator for care and PDPA compliance.</p><button class="pri full" data-a="c1">I agree — ask ${mentor[1]}</button>` : consentLevel == 1 ? `<p>Waiting for ${mentor[1]} to agree…</p><div class="grid"><button class="pri" data-a="c2">${mentor[1]} agrees (demo)</button><button data-a="c0">Cancel request</button></div>` : `<p class="mut">[Live transcript placeholder for the hackathon]</p><p class="mut">Sensitive topics are flagged to your parish coordinator.</p><button class="full" data-a="c0">Stop transcript</button>`) : `<textarea id="notes" rows="6" aria-label="My notes" placeholder="Private notes, autosaved">${S.notes}</textarea>`}</div></div></div>`;
  },
  take() {
    const mentor = mt(S.mid);
    return `${hd("Key takeaways", `${mentor[1]} · ${dl(days[S.date])} · 30 min`, "profile")}<div class="pad" style="margin-top:12px"><div class="card"><h3>Your notes</h3><p>${S.notes || '<span class="mut">No notes taken.</span>'}</p></div><div class="card"><h3>Topics covered</h3>${S.topics.map((topic) => `<span class="tag">${topic}</span>`).join("")}</div><div class="card"><h3>Transcript</h3><p class="mut">Only saved when both you and your mentor agreed to transcription during the call.${S.hadTr ? " Placeholder transcript saved. Sensitive topics, if any, are flagged to your coordinator for follow-up." : ""}</p></div>
<button class="pri full" style="margin-bottom:8px" data-a="again">Book another session</button><button class="full" data-a="go" data-v="profile">Done</button></div>`;
  },
  admin() {
    return `${hd("Coordinator Dashboard", "Parish oversight and case management", "profile")}<div class="pad"><div class="card"><h3>Session flagging</h3><p>Monitor flagged sessions and sensitive topics from mentee-mentor interactions.</p></div><div class="card"><h3>Account management</h3><p>Manage mentee and mentor accounts, parish assignments, and training progress.</p></div><div class="card"><h3>Reports</h3><p>View analytics on formation completion, session attendance, and engagement.</p></div><p class="mut" style="text-align:center;margin-top:20px;font-size:12px">This feature is coming soon.</p></div>`;
  },
};
