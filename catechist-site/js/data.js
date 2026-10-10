// data.js — Demo data: parishes, users, formation courses, topics (from data-model.md). Replaced by API calls in the full build.
const parishNames = {
  ig: "St Ignatius",
  hs: "Holy Spirit",
  rc: "Risen Christ",
  gs: "Good Shepherd",
};

const ageRanges = ["20s", "30s", "40s", "50s+"];

// Fallback user shown when nobody is logged in
const fallbackUser = { id: 0, name: "Joanna Tan", parish: "ig", age: "20s", year: 1 };

// Demo accounts (seeded into localStorage on first load)
const seedMentees = () => [
  { id: 0, name: "Joanna Tan", parish: "ig", age: "20s", year: 1, email: "joanna.tan@example.com", password: "password123" },
  { id: 1, name: "Grace Ong", parish: "ig", age: "20s", year: 2, email: "grace.ong@example.com", password: "password123" },
  { id: 2, name: "Marcus Lim", parish: "hs", age: "20s", year: 1, email: "marcus.lim@example.com", password: "password123" },
  { id: 3, name: "Rachel Teo", parish: "rc", age: "30s", year: 3, email: "rachel.teo@example.com", password: "password123" },
];
const seedMentors = () => [
  { id: 11, name: "Patricia Lee", parish: "ig", age: "50s+", yearsServing: 15, email: "patricia.lee@example.com", password: "password123", skills: ["Classroom management", "Sacrament prep"] },
  { id: 12, name: "Joseph Tan", parish: "hs", age: "40s", yearsServing: 10, email: "joseph.tan@example.com", password: "password123", skills: ["Scripture", "Youth"] },
  { id: 13, name: "Mary Chua", parish: "rc", age: "30s", yearsServing: 6, email: "mary.chua@example.com", password: "password123", skills: ["Youth", "Classroom management"] },
];
const seedAdmin = () => ({ id: 99, name: "Admin", email: "admin@example.com", password: "password123", parish: "ig" });

// Mentees you can search for / befriend
const menteeDirectory = [
  { id: 1, name: "Grace Ong", parish: "ig", year: 2 },
  { id: 2, name: "Marcus Lim", parish: "hs", year: 1 },
  { id: 3, name: "Rachel Teo", parish: "rc", year: 3 },
  { id: 4, name: "Benedict Ho", parish: "ig", year: 1 },
  { id: 5, name: "Clara Ng", parish: "hs", year: 2 },
  { id: 6, name: "Daniel Koh", parish: "gs", year: 1 },
  { id: 7, name: "Samuel Yeo", parish: "ig", year: 1 },
  { id: 8, name: "Teresa Lau", parish: "rc", year: 3 },
  { id: 9, name: "Paul Sim", parish: "ig", year: 4 },
];

// Mentors you can book
const mentorDirectory = [
  { id: 11, name: "Patricia Lee", parish: "ig", age: "50s+", yearsServing: 15, skills: ["Classroom management", "Sacrament prep"] },
  { id: 12, name: "Joseph Tan", parish: "hs", age: "40s", yearsServing: 10, skills: ["Scripture", "Youth"] },
  { id: 13, name: "Mary Chua", parish: "rc", age: "30s", yearsServing: 6, skills: ["Youth", "Classroom management"] },
  { id: 14, name: "Anthony Goh", parish: "gs", age: "50s+", yearsServing: 20, skills: ["Scripture", "Sacrament prep"] },
];

const mentorSkills = ["Classroom management", "Sacrament prep", "Scripture", "Youth"];

const sessionTopics = [
  "Knowledge sharing",
  "Classroom management",
  "Burnout management",
  "Safe space",
  "Fellowship",
];

// Each course group: [title, requirement, items]
const formationCourses = {
  1: [
    ["Retreat & orientation", "Required", ["Orientation for New Catechists"]],
    [
      "Foundational Course (FCC)",
      "Required",
      ["Intro to Catechetical Pedagogy & Methods", "Learning to Listen & Facilitate"],
    ],
    ["Basic Course (BCC)", "Choose 1", ["Scripture", "Liturgy"]],
    ["Additional", "Optional", ["1 more BCC course"]],
  ],
  2: [
    ["Retreat & recollection", "Required", ["Catechists' Retreat and/or Day of Recollection"]],
    ["Foundational Course (FCC)", "Required", ["Five Strategies for Living out the Virtues"]],
    ["Basic Course (BCC)", "Choose 2", ["Scripture", "Liturgy", "Prayer", "Sacraments", "EV & M"]],
    ["Additional", "Optional", ["1 Elective Course (ECC)", "1 Craft of Catechesis Workshop"]],
  ],
  3: [
    ["Retreat & recollection", "Required", ["Catechists' Retreat and/or Day of Recollection"]],
    [
      "Basic Course (BCC)",
      "Choose 3",
      ["Liturgy", "Prayer", "Sacraments", "EV & M", "Christian Anthropology", "Intro to Morality"],
    ],
    ["Additional", "Optional", ["1 Elective Course (ECC)", "1 Craft of Catechesis Workshop"]],
  ],
  4: [
    ["Retreat & recollection", "Required", ["Catechists' Retreat and/or Day of Recollection"]],
    ["Refreshers", "Refresher", ["Catechetical Pedagogy (Refresher)", "BCC Refresher"]],
  ],
};

const libraryCategories = [
  "Classroom management",
  "Knowledge",
  "Fellowship",
  "Difficult situations in class",
];

// Home screen: upcoming courses/events
const upcomingEvents = [
  {
    day: "17",
    month: "Oct",
    title: "Day of Recollection",
    detail: "Cathedral of the Good Shepherd · 9:00 AM",
  },
];

// Quick words of encouragement friends can send each other
const encouragementOptions = [
  { emoji: "🙏", label: "praying hands" },
  { emoji: "❤️", label: "a heart" },
  { emoji: "👏", label: "clapping hands" },
];