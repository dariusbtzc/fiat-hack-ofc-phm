// state.js — App state (S) and small helpers: DOM lookup, initials, date and slot helpers.
const S = {
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
const $ = (s) => document.querySelector(s),
  ini = (n) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("");
const mn = (id) => menteesN.find((m) => m[0] == id),
  mt = (id) => mentors.find((m) => m[0] == id);
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
  if (!S.sessionUser) return null;
  // Return cached user data from session to ensure consistency
  return {
    id: S.sessionUser.id,
    name: S.sessionUser.name,
    p: S.sessionUser.parish,
    age: S.sessionUser.age,
    yr: S.sessionUser.yr,
    yrs: S.sessionUser.yrs,
  };
};

