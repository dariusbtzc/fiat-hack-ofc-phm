// auth.js — Authentication module: login, register, logout, session management.
const AUTH = {
  SESSION_KEY: "auth.session",
  ACCOUNTS_KEY: "auth.accounts",

  // Initialize auth on first load: seed demo accounts if none exist
  initAuth() {
    if (!localStorage.getItem(this.ACCOUNTS_KEY)) {
      this.seedDemoAccounts();
    }
  },

  // Get current session from localStorage, or null if no active session
  getSession() {
    const savedSession = localStorage.getItem(this.SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  },

  // Save the session for an account in localStorage
  setSession(account) {
    const session = { accountType: account.accountType, user: this.toSessionUser(account) };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Clear session
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  // Get all stored accounts (keyed by lowercase email)
  getAccounts() {
    const savedAccounts = localStorage.getItem(this.ACCOUNTS_KEY);
    return savedAccounts ? JSON.parse(savedAccounts) : {};
  },

  // Store accounts
  setAccounts(accounts) {
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  // The public-facing user object kept in the session (no password)
  toSessionUser(account) {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      accountType: account.accountType,
      parish: account.parish,
      age: account.age,
      year: account.year,
      yearsServing: account.yearsServing,
      skills: account.skills,
    };
  },

  // Login with email and password
  login(email, password) {
    const accounts = this.getAccounts();
    const account = accounts[email.toLowerCase()];
    if (!account) return { error: "Email not found" };
    if (account.password !== password) return { error: "Password incorrect" };

    return this.setSession(account);
  },

  // Register a new account
  register(email, password, name, accountType, details) {
    const emailLower = email.toLowerCase();
    const accounts = this.getAccounts();

    // Validation
    if (accounts[emailLower]) return { error: "Email already exists" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };
    if (!name || !accountType) return { error: "Name and account type required" };

    const account = this.makeAccount(accountType, {
      id: Date.now(), // unique, and never clashes with the small demo ids
      email: emailLower,
      password,
      name,
      parish: details.parish || "ig",
      age: details.age || "20s",
      year: accountType === "mentee" ? 1 : undefined,
      yearsServing: accountType === "mentor" ? 1 : undefined,
    });

    accounts[emailLower] = account;
    this.setAccounts(accounts);

    // Auto-login
    return this.setSession(account);
  },

  // Stored account record; `person` comes from the register form or the demo seed data
  makeAccount(accountType, person) {
    return {
      id: person.id,
      email: person.email.toLowerCase(),
      password: person.password,
      name: person.name,
      accountType,
      parish: person.parish,
      age: person.age,
      year: person.year,
      yearsServing: person.yearsServing,
      skills: person.skills || [],
    };
  },

  // Seed demo accounts on first load
  seedDemoAccounts() {
    const accounts = {};
    const add = (accountType, person) => {
      const account = this.makeAccount(accountType, person);
      accounts[account.email] = account;
    };
    seedMentees().forEach((mentee) => add("mentee", mentee));
    seedMentors().forEach((mentor) => add("mentor", mentor));
    add("admin", seedAdmin());
    this.setAccounts(accounts);
  },
};
