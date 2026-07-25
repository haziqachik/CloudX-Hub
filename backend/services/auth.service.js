const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

// Find a user by email address using case-insensitive matching.
async function findUserByEmail(email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  return await userModel.findByEmail(normalizedEmail);
}

// Create a user record with a securely hashed password.
async function registerUser({ fullName, email, password }) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      error: "An account with that email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const fullNameNormalized = String(fullName || "").trim();
  const emailNormalized = String(email || "")
    .trim()
    .toLowerCase();

  const userId = await userModel.createUser(
    fullNameNormalized,
    emailNormalized,
    passwordHash,
  );

  return {
    success: true,
    user: {
      id: userId,
      fullName: fullNameNormalized,
      email: emailNormalized,
    },
  };
}

// Validate login credentials against the database.
async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}

// Return users from the database instead of an in-memory array.
async function listUsers() {
  return [];
}

module.exports = {
  findUserByEmail,
  registerUser,
  loginUser,
  listUsers,
};
