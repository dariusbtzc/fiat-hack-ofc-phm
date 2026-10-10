// data.js — Demo data: parishes, users, formation courses, topics (from data-model.md). Replaced by API calls in the full build.
const ParishName = {
  ig: "St Ignatius",
  hs: "Holy Spirit",
  rc: "Risen Christ",
  gs: "Good Shepherd",
};
const mentees = { id: 0, name: "Joanna Tan", p: "ig", age: "20s", yr: 1 };
const seedMentees = () => [
  { id: 0, name: "Joanna Tan", p: "ig", age: "20s", yr: 1, email: "joanna.tan@example.com", password: "password123" },
  { id: 1, name: "Grace Ong", p: "ig", age: "20s", yr: 2, email: "grace.ong@example.com", password: "password123" },
  { id: 2, name: "Marcus Lim", p: "hs", age: "20s", yr: 1, email: "marcus.lim@example.com", password: "password123" },
  { id: 3, name: "Rachel Teo", p: "rc", age: "30s", yr: 3, email: "rachel.teo@example.com", password: "password123" },
];
const seedMentors = () => [
  { id: 11, name: "Patricia Lee", p: "ig", age: "50s+", yrs: 15, email: "patricia.lee@example.com", password: "password123", skills: ["Classroom management", "Sacrament prep"] },
  { id: 12, name: "Joseph Tan", p: "hs", age: "40s", yrs: 10, email: "joseph.tan@example.com", password: "password123", skills: ["Scripture", "Youth"] },
  { id: 13, name: "Mary Chua", p: "rc", age: "30s", yrs: 6, email: "mary.chua@example.com", password: "password123", skills: ["Youth", "Classroom management"] },
];
const seedAdmin = () => ({ id: 99, name: "Admin", email: "admin@example.com", password: "password123", p: "ig" });
const menteesN = [
  [1, "Grace Ong", "ig", 2],
  [2, "Marcus Lim", "hs", 1],
  [3, "Rachel Teo", "rc", 3],
  [4, "Benedict Ho", "ig", 1],
  [5, "Clara Ng", "hs", 2],
  [6, "Daniel Koh", "gs", 1],
  [7, "Samuel Yeo", "ig", 1],
  [8, "Teresa Lau", "rc", 3],
  [9, "Paul Sim", "ig", 4],
];
const mentors = [
  [
    11,
    "Patricia Lee",
    "ig",
    "50s+",
    15,
    ["Classroom management", "Sacrament prep"],
  ],
  [12, "Joseph Tan", "hs", "40s", 10, ["Scripture", "Youth"]],
  [13, "Mary Chua", "rc", "30s", 6, ["Youth", "Classroom management"]],
  [14, "Anthony Goh", "gs", "50s+", 20, ["Scripture", "Sacrament prep"]],
];
const skills = ["Classroom management", "Sacrament prep", "Scripture", "Youth"];
const topics = [
  "Knowledge sharing",
  "Classroom management",
  "Burnout management",
  "Safe space",
  "Fellowship",
];
const formationCourses = {
  1: [
    ["Retreat & orientation", "Required", ["Orientation for New Catechists"]],
    [
      "Foundational Course (FCC)",
      "Required",
      [
        "Intro to Catechetical Pedagogy & Methods",
        "Learning to Listen & Facilitate",
      ],
    ],
    ["Basic Course (BCC)", "Choose 1", ["Scripture", "Liturgy"]],
    ["Additional", "Optional", ["1 more BCC course"]],
  ],
  2: [
    [
      "Retreat & recollection",
      "Required",
      ["Catechists' Retreat and/or Day of Recollection"],
    ],
    [
      "Foundational Course (FCC)",
      "Required",
      ["Five Strategies for Living out the Virtues"],
    ],
    [
      "Basic Course (BCC)",
      "Choose 2",
      ["Scripture", "Liturgy", "Prayer", "Sacraments", "EV & M"],
    ],
    [
      "Additional",
      "Optional",
      ["1 Elective Course (ECC)", "1 Craft of Catechesis Workshop"],
    ],
  ],
  3: [
    [
      "Retreat & recollection",
      "Required",
      ["Catechists' Retreat and/or Day of Recollection"],
    ],
    [
      "Basic Course (BCC)",
      "Choose 3",
      [
        "Liturgy",
        "Prayer",
        "Sacraments",
        "EV & M",
        "Christian Anthropology",
        "Intro to Morality",
      ],
    ],
    [
      "Additional",
      "Optional",
      ["1 Elective Course (ECC)", "1 Craft of Catechesis Workshop"],
    ],
  ],
  4: [
    [
      "Retreat & recollection",
      "Required",
      ["Catechists' Retreat and/or Day of Recollection"],
    ],
    [
      "Refreshers",
      "Refresher",
      ["Catechetical Pedagogy (Refresher)", "BCC Refresher"],
    ],
  ],
};
const libraryCategories = [
  "Classroom management",
  "Knowledge",
  "Fellowship",
  "Difficult situations in class",
];
