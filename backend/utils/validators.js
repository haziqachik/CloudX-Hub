// Validate whether an email value has a standard email structure.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// Validate registration input and return user-friendly error messages.
function validateRegistrationInput(payload) {
  const errors = [];
  const fullName = String(payload.fullName || '').trim();
  const email = String(payload.email || '').trim();
  const password = String(payload.password || '');
  const confirmPassword = String(payload.confirmPassword || '');

  if (!fullName) {
    errors.push('Full name is required.');
  }

  if (!email) {
    errors.push('Email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (!confirmPassword) {
    errors.push('Password confirmation is required.');
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push('Password and confirm password do not match.');
  }

  return errors;
}

// Validate login input and return user-friendly error messages.
function validateLoginInput(payload) {
  const errors = [];
  const email = String(payload.email || '').trim();
  const password = String(payload.password || '');

  if (!email) {
    errors.push('Email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return errors;
}

module.exports = {
  isValidEmail,
  validateRegistrationInput,
  validateLoginInput,
};
