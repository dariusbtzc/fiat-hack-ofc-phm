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
    const sess = localStorage.getItem(this.SESSION_KEY);
    return sess ? JSON.parse(sess) : null;
  },

  // Set session in localStorage
  setSession(userId, accountType, user) {
    const session = { userId, accountType, user };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  },

  // Clear session
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  // Get all stored accounts
  getAccounts() {
    const accounts = localStorage.getItem(this.ACCOUNTS_KEY);
    return accounts ? JSON.parse(accounts) : {};
  },

  // Store accounts
  setAccounts(accounts) {
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  // Login with email and password
  login(email, password) {
    const accounts = this.getAccounts();
    const account = accounts[email.toLowerCase()];
    if (!account) return { error: "Email not found" };
    if (account.password !== password) return { error: "Password incorrect" };
    
    // Return session for the account
    return this.setSession(account.id, account.accountType, {
      id: account.id,
      name: account.name,
      email: account.email,
      accountType: account.accountType,
      parish: account.parish || account.p,
      age: account.age,
      yr: account.yr,
      yrs: account.yrs,
      skills: account.skills,
    });
  },

  // Register a new account
  register(email, password, name, accountType, details) {
    const emailLower = email.toLowerCase();
    const accounts = this.getAccounts();
    
    // Validation
    if (accounts[emailLower]) return { error: "Email already exists" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };
    if (!name || !accountType) return { error: "Name and account type required" };
    
    // Create new account
    const id = Math.floor(Math.random() * 10000);
    const account = {
      id,
      email: emailLower,
      password,
      name,
      accountType,
      parish: details.parish || "ig",
      age: details.age || "20s",
      yr: details.yr || 1,
      yrs: details.yrs || 1,
      skills: details.skills || [],
    };
    
    // Store account
    accounts[emailLower] = account;
    this.setAccounts(accounts);
    
    // Auto-login
    return this.setSession(id, accountType, {
      id,
      name,
      email,
      accountType,
      parish: account.parish,
      age: account.age,
      yr: account.yr,
      yrs: account.yrs,
      skills: account.skills,
    });
  },

  // Seed demo accounts on first load
  seedDemoAccounts() {
    const accounts = {};
    
    // Add demo mentees
    const mentees = seedMentees();
    mentees.forEach(m => {
      accounts[m.email.toLowerCase()] = {
        id: m.id,
        email: m.email.toLowerCase(),
        password: m.password,
        name: m.name,
        accountType: "mentee",
        parish: m.p,
        age: m.age,
        yr: m.yr,
        yrs: undefined,
        skills: [],
      };
    });
    
    // Add demo mentors
    const mentors = seedMentors();
    mentors.forEach(m => {
      accounts[m.email.toLowerCase()] = {
        id: m.id,
        email: m.email.toLowerCase(),
        password: m.password,
        name: m.name,
        accountType: "mentor",
        parish: m.p,
        age: m.age,
        yr: undefined,
        yrs: m.yrs,
        skills: m.skills,
      };
    });
    
    // Add admin
    const admin = seedAdmin();
    accounts[admin.email.toLowerCase()] = {
      id: admin.id,
      email: admin.email.toLowerCase(),
      password: admin.password,
      name: admin.name,
      accountType: "admin",
      parish: admin.p,
      age: undefined,
      yr: undefined,
      yrs: undefined,
      skills: [],
    };
    
    this.setAccounts(accounts);
  },
};
