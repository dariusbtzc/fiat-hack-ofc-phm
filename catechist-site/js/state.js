// state.js — App state (appState) and small helpers: DOM lookup, initials, date and slot helpers.

// Transcription consent flow during a call
const CONSENT = {
  NONE: 0, // transcription off
  WAITING_FOR_MENTOR: 1, // mentee agreed, waiting for the mentor
  BOTH_AGREED: 2, // both agreed, transcript running
};

const SESSION_SECONDS = 30 * 60;

const appState = {
  screen: "login",
  accountType: null, // "mentee" | "mentor" | "admin" once logged in
  sessionUser: null, // the logged-in user (from AUTH)

  // Friends
  friends: new Set([1, 2, 3, 4]), // ids of accepted mentee friends
  sentRequests: new Set(), // ids we've sent a friend request to
  incomingRequests: [5, 6], // ids who've sent us a friend request
  reactions: {}, // menteeId -> emoji we sent them
  suggestionScope: "all", // home "Add a friend" filter: "all" | "same" | "other" parish
  suggestionYear: 0, // home "Add a friend" filter: 0 = any level, 1-4 (4 = 4+)
  fellowshipGroups: new Set(), // ids of fellowship groups we've created

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

// The logged-in user. Every screen except login/register needs one, so screens can rely on it.
const getCurrentUser = () => appState.sessionUser;

// Other mentees in the directory: the logged-in user never appears as their own friend or suggestion
const getOtherMentees = () => menteeDirectory.filter((mentee) => mentee.id !== getCurrentUser()?.id);
const getFriends = () => getOtherMentees().filter((mentee) => appState.friends.has(mentee.id));

// Mentees the user could befriend, filtered by the home-screen controls (own parish first)
const getSuggestedFriends = () => {
  const user = getCurrentUser();
  return getOtherMentees()
    .filter(
      (mentee) =>
        !appState.friends.has(mentee.id) &&
        !appState.incomingRequests.includes(mentee.id) &&
        (appState.suggestionScope === "all" ||
          (appState.suggestionScope === "same") === (mentee.parish === user.parish)) &&
        (!appState.suggestionYear || Math.min(mentee.year, 4) === appState.suggestionYear),
    )
    .sort((a, b) => Number(b.parish === user.parish) - Number(a.parish === user.parish));
};

// Fellowship groups worth starting, worked out from who is in the user's friend network
const getFellowshipRecommendations = () => {
  const user = getCurrentUser();
  const friendList = getFriends();

  const parishGroups = Object.keys(parishNames)
    .map((parish) => ({
      id: `parish-${parish}`,
      name: `${parishNames[parish]} Fellowship`,
      description: parish === user.parish ? "Friends from your own parish" : "Friends from this parish",
      members: friendList.filter((mentee) => mentee.parish === parish),
      isOwnParish: parish === user.parish,
    }))
    .filter((group) => group.members.length >= 2);

  const ownParishGroups = parishGroups.filter((group) => group.isOwnParish);
  const otherParishGroups = parishGroups.filter((group) => !group.isOwnParish);

  const yearGroups = [];
  if (user.year) {
    const level = Math.min(user.year, 4);
    const peers = friendList.filter((mentee) => Math.min(mentee.year, 4) === level);
    if (peers.length >= 2) {
      yearGroups.push({
        id: `year-${level}`,
        name: `Year ${level}${level === 4 ? "+" : ""} Circle`,
        description: "Peers at the same stage of formation",
        members: peers,
      });
    }
  }

  const crossParishGroups = [];
  const outsideParish = friendList.filter((mentee) => mentee.parish !== user.parish);
  if (outsideParish.length >= 2) {
    crossParishGroups.push({
      id: "cross-parish",
      name: "Across Parishes",
      description: "Catechists from different parishes",
      members: outsideParish,
    });
  }

  return [...ownParishGroups, ...yearGroups, ...crossParishGroups, ...otherParishGroups].slice(0, 3);
};
