// state.js — App state (appState) and small helpers: DOM lookup, initials, date and slot helpers.
const appState = {
  scr: "profile",
  userId: null,
  accountType: null,
  sessionUser: null,
  fr: new Set([1, 2, 3, 4]),
  req: new Set(),
  inc: [5, 6],
  rx: {},
  tab: 1,
  done: new Set(),
  mid: null,
  date: null,
  time: null,
  topics: [],
  note: "",
  notes: "",
  cons: 0,
  pf: "",
  af: "",
  sf: "",
  q: "",
  lib: null,
  tr: 0,
  t: 1800,
  loginEmail: "",
  loginPassword: "",
  regEmail: "",
  regPassword: "",
  regName: "",
  regAccountType: "mentee",
  regParish: "ig",
  regAge: "20s",
};
const querySelector = (s) => document.querySelector(s),
  getInitials = (n) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("");
const getMentee = (id) => menteesN.find((m) => m[0] == id),
  getMentor = (id) => mentors.find((m) => m[0] == id);
const days = [];
{
  let d = new Date();
  while (days.length < 5) {
    d = new Date(d.getTime() + 864e5);
    if (d.getDay() % 6) days.push(new Date(d));
  }
}
const dl = (d) =>
  d.toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
const times = ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"];
const booked = (m, d, t) => (m + d + t) % 5 == 0;

// Helper to get current user from cached session state
const getCurrUser = () => {
  if (!appState.sessionUser) return null;
  // Return cached user data from session to ensure consistency
  return {
    id: appState.sessionUser.id,
    name: appState.sessionUser.name,
    p: appState.sessionUser.parish,
    age: appState.sessionUser.age,
    yr: appState.sessionUser.yr,
    yrs: appState.sessionUser.yrs,
  };
};

