const bcrypt = require('bcrypt');

// Keep users in memory temporarily until database integration is added.
const users = [];

// Find a user by email address using case-insensitive matching.
function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

// Create a user record with a securely hashed password.
async function registerUser({ fullName, email, password }) {
  const existingUser = findUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      error: 'An account with that email already exists.',
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    fullName: String(fullName || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  };

  users.push(user);

  return {
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  };
}

// Validate login credentials against the in-memory user store.
async function loginUser({ email, password }) {
  const user = findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password.',
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Invalid email or password.',
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  };
}

// Expose the current in-memory users for non-production diagnostics/testing.
function listUsers() {
  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  }));
}

module.exports = {
  findUserByEmail,
  registerUser,
  loginUser,
  listUsers,
};
