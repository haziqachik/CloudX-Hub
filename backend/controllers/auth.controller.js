const {
  validateRegistrationInput,
  validateLoginInput,
} = require('../utils/validators');
const { registerUser, loginUser } = require('../services/auth.service');

// Render the registration page with optional validation messages.
function getRegisterPage(req, res) {
  return res.render('register', {
    errors: [],
    formData: {
      fullName: '',
      email: '',
    },
  });
}

// Render the login page with optional validation messages.
function getLoginPage(req, res) {
  return res.render('login', {
    errors: [],
    formData: {
      email: '',
    },
  });
}

// Handle registration by validating input, hashing password, creating a session, and redirecting to the dashboard.
async function register(req, res) {
  const { fullName, email, password, confirmPassword } = req.body;
  const formData = {
    fullName: String(fullName || '').trim(),
    email: String(email || '').trim(),
  };

  const errors = validateRegistrationInput({
    fullName,
    email,
    password,
    confirmPassword,
  });

  if (errors.length > 0) {
    return res.status(400).render('register', { errors, formData });
  }

  const result = await registerUser({ fullName, email, password });

  if (!result.success) {
    return res.status(400).render('register', {
      errors: [result.error],
      formData,
    });
  }

  req.session.user = result.user;
  return res.redirect('/dashboard');
}

// Handle login by validating credentials, storing authenticated session data, and redirecting to the dashboard.
async function login(req, res) {
  const { email, password } = req.body;
  const formData = {
    email: String(email || '').trim(),
  };

  const errors = validateLoginInput({ email, password });

  if (errors.length > 0) {
    return res.status(400).render('login', { errors, formData });
  }

  const result = await loginUser({ email, password });

  if (!result.success) {
    return res.status(401).render('login', {
      errors: [result.error],
      formData,
    });
  }

  req.session.user = result.user;
  return res.redirect('/dashboard');
}

// Handle logout by destroying the session and redirecting users to the home page.
function logout(req, res) {
  return req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = {
  getRegisterPage,
  getLoginPage,
  register,
  login,
  logout,
};
