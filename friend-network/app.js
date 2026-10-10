/* ============ DATA LAYER (swap this for your backend) ============
   Status per user: "none" | "sent" | "incoming" | "friends"
   Replace the bodies of these methods with API calls; the UI below
   only talks to FriendNetwork, never to the data array directly. */
const FriendNetwork = (() => {
  const KEY = "friend-network-v1";
  let users = [
    { id: 1, name: "Aisha Rahman", bio: "Design student", status: "friends" },
    {
      id: 2,
      name: "Daniel Koh",
      bio: "Loves hiking and coding",
      status: "friends",
    },
    { id: 3, name: "Priya Nair", bio: "Product designer", status: "incoming" },
    {
      id: 4,
      name: "Wei Jie Chen",
      bio: "Basketball and music",
      status: "incoming",
    },
    { id: 5, name: "Marcus Lim", bio: "Software engineer", status: "sent" },
    { id: 6, name: "Grace Lee", bio: "Data analyst", status: "none" },
    { id: 7, name: "Nur Aisyah", bio: "Reads a lot", status: "none" },
    { id: 8, name: "Ravi Menon", bio: "Teacher and runner", status: "none" },
    { id: 9, name: "Siti Rahmah", bio: "Volunteer organiser", status: "none" },
  ];
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(s)) users = s;
  } catch (e) {}
  const subs = [];
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(users));
    } catch (e) {}
    subs.forEach((f) => f());
  };
  const set = (id, status) => {
    const u = users.find((x) => x.id === id);
    if (u) {
      u.status = status;
      save();
    }
    return u;
  };
  return {
    list: (s) => users.filter((u) => u.status === s),
    send: (id) => set(id, "sent"),
    cancel: (id) => set(id, "none"),
    accept: (id) => set(id, "friends"),
    decline: (id) => set(id, "none"),
    remove: (id) => set(id, "none"),
    subscribe: (f) => subs.push(f),
  };
})();

/* ============ UI LAYER ============ */
const $ = (s) => document.querySelector(s);
const COLORS = ["#2F6BFF", "#E5384F", "#1FB59A", "#7A5AF8", "#F08A24"];
const ini = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("");
const toast = (t) => {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("on");
  setTimeout(() => e.classList.remove("on"), 2400);
};
const TABS = {
  friends: {
    label: "Friends",
    status: "friends",
    empty: "No friends yet. Find people to send your first request.",
    acts: (u) => [["remove", "Remove", "alt"]],
  },
  requests: {
    label: "Requests",
    status: "incoming",
    empty: "No requests right now.",
    acts: (u) => [
      ["accept", "Accept"],
      ["decline", "Decline", "alt"],
    ],
  },
  sent: {
    label: "Sent",
    status: "sent",
    empty: "You have no pending requests.",
    acts: (u) => [["cancel", "Cancel", "alt"]],
  },
  discover: {
    label: "Find people",
    status: "none",
    empty: "No one new to show. Try a different search.",
    acts: (u) => [["send", "Add friend"]],
  },
};
const MSG = {
  send: "Request sent to ",
  cancel: "Request cancelled for ",
  accept: "You and * are now friends.",
  decline: "Declined request from ",
  remove: "Removed ",
};
let tab = "friends";

function render() {
  document.querySelectorAll("#tabs button").forEach((b) => {
    const t = b.dataset.t,
      c = FriendNetwork.list(TABS[t].status).length;
    b.setAttribute("aria-selected", t === tab);
    b.innerHTML =
      TABS[t].label +
      (c && t !== "discover"
        ? `<span class="n ${t === "requests" ? "" : "mute"}">${c}</span>`
        : "");
  });
  const q = $("#q").value.trim().toLowerCase(),
    T = TABS[tab];
  const rows = FriendNetwork.list(T.status).filter((u) =>
    u.name.toLowerCase().includes(q),
  );
  $("#list").innerHTML = rows.length
    ? rows
        .map(
          (u) =>
            `<div class="row"><div class="av" style="background:${COLORS[u.id % 5]}">${ini(u.name)}</div><div class="info"><b>${u.name}</b><span>${u.bio}</span></div><div class="acts">${T.acts(
              u,
            )
              .map(
                ([a, l, c]) =>
                  `<button class="btn ${c || ""}" data-a="${a}" data-id="${u.id}">${l}</button>`,
              )
              .join("")}</div></div>`,
        )
        .join("")
    : `<div class="empty">${T.empty}</div>`;
}

$("#tabs").onclick = (e) => {
  const b = e.target.closest("[data-t]");
  if (b) {
    tab = b.dataset.t;
    render();
  }
};
$("#q").oninput = render;
$("#list").onclick = (e) => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const u = FriendNetwork[b.dataset.a](+b.dataset.id);
  toast(
    MSG[b.dataset.a].includes("*")
      ? MSG.accept.replace("*", u.name)
      : MSG[b.dataset.a] + u.name + ".",
  );
};
FriendNetwork.subscribe(render);
render();
