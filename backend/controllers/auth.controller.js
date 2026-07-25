const {
  validateRegistrationInput,
  validateLoginInput,
} = require("../utils/validators");

const { registerUser, loginUser } = require("../services/auth.service");

const { createActivity } = require("../models/activity.model");

// Render registration page.
function getRegisterPage(req, res) {
  return res.render("register", {
    errors: [],
    formData: {
      fullName: "",
      email: "",
    },
  });
}

// Render login page.
function getLoginPage(req, res) {
  return res.render("login", {
    errors: [],
    formData: {
      email: "",
    },
  });
}

// Handle registration.
async function register(req, res) {
  const { fullName, email, password, confirmPassword } = req.body;

  const formData = {
    fullName: String(fullName || "").trim(),
    email: String(email || "").trim(),
  };

  const errors = validateRegistrationInput({
    fullName,
    email,
    password,
    confirmPassword,
  });

  if (errors.length > 0) {
    return res.status(400).render("register", {
      errors,
      formData,
    });
  }

  const result = await registerUser({
    fullName,
    email,
    password,
  });

  if (!result.success) {
    return res.status(400).render("register", {
      errors: [result.error],
      formData,
    });
  }

  req.session.user = result.user;

  await createActivity(result.user.id, "REGISTER", req.ip);

  return res.redirect("/dashboard");
}

// Handle login.
async function login(req, res) {
  const { email, password } = req.body;

  const formData = {
    email: String(email || "").trim(),
  };

  const errors = validateLoginInput({
    email,
    password,
  });

  if (errors.length > 0) {
    return res.status(400).render("login", {
      errors,
      formData,
    });
  }

  const result = await loginUser({
    email,
    password,
  });

  if (!result.success) {
    return res.status(401).render("login", {
      errors: [result.error],
      formData,
    });
  }

  req.session.user = result.user;

  await createActivity(result.user.id, "LOGIN", req.ip);

  return res.redirect("/dashboard");
}

// Handle logout.
async function logout(req, res) {
  if (req.session.user) {
    await createActivity(req.session.user.id, "LOGOUT", req.ip);
  }

  return req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  getRegisterPage,
  getLoginPage,
  register,
  login,
  logout,
};
