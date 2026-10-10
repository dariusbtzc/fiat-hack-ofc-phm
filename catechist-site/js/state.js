// state.js — App state (appState) and small helpers: DOM lookup, initials, date and slot helpers.

// Transcription consent flow during a call
const CONSENT = {
  NONE: 0, // transcription off
  WAITING_FOR_MENTOR: 1, // mentee agreed, waiting for the mentor
  BOTH_AGREED: 2, // both agreed, transcript running
};

const SESSION_SECONDS = 30 * 60;

const appState = {
  screen: "profile",
  userId: null,
  accountType: null,
  sessionUser: null,

  // Friends
  friends: new Set([1, 2, 3, 4]), // ids of accepted friends
  sentRequests: new Set(), // ids we've sent a friend request to
  incomingRequests: [5, 6], // ids who've sent us a friend request
  reactions: {}, // menteeId -> emoji we sent them

  // Formation journey
  journeyYear: 1, // which year tab is showing
  completedItems: new Set(), // keys from makeItemKey(year, item)

  // Booking a mentor session
  mentorId: null,
  selectedDayIndex: null, // index into upcomingDays
  selectedTime: null,
  topics: [],
  bookingNote: "", // note to the mentor, written while booking
  inviteAccepted: false,

  // Live call
  sessionNotes: "", // private notes taken during the call
  consentLevel: CONSENT.NONE,
  callTab: 0, // 0 = My notes, 1 = Transcript
  hadTranscript: false,
  secondsLeft: SESSION_SECONDS,
  timerInterval: null,
  sessionCount: 0, // completed mentor sessions

  // Filters, search, library
  parishFilter: "",
  ageFilter: "",
  skillFilter: "",
  searchQuery: "",
  openLibraryCategory: null,

  // Login / register form fields
  loginEmail: "",
  loginPassword: "",
  regEmail: "",
  regPassword: "",
  regName: "",
  regAccountType: "mentee",
  regParish: "ig",
  regAge: "20s",
};

const querySelector = (selector) => document.querySelector(selector);

const getInitials = (fullName) =>
  fullName
    .split(" ")
    .map((word) => word[0])
    .join("");

const getMentee = (menteeId) => menteeDirectory.find((mentee) => mentee.id === Number(menteeId));
const getMentor = (mentorId) => mentorDirectory.find((mentor) => mentor.id === Number(mentorId));

// The next 5 weekdays (skipping Saturdays and Sundays), starting from tomorrow
const upcomingDays = [];
{
  const MS_PER_DAY = 864e5;
  let currentDate = new Date();
  while (upcomingDays.length < 5) {
    currentDate = new Date(currentDate.getTime() + MS_PER_DAY);
    const isWeekday = currentDate.getDay() % 6 !== 0; // 0 = Sunday, 6 = Saturday
    if (isWeekday) upcomingDays.push(new Date(currentDate));
  }
}

const formatDayLabel = (date) =>
  date.toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const timeSlots = ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"];

// Placeholder rule for demo purposes: a slot is "booked" when the three numbers sum to a multiple of 5
const isSlotBooked = (mentorId, dayIndex, timeIndex) => (mentorId + dayIndex + timeIndex) % 5 === 0;

// Current user, read from the cached session so it stays consistent
const getCurrentUser = () => {
  if (!appState.sessionUser) return null;
  const user = appState.sessionUser;
  return {
    id: user.id,
    name: user.name,
    parish: user.parish,
    age: user.age,
    year: user.year, // mentees: formation year
    yearsServing: user.yearsServing, // mentors: years as a catechist
  };
};
