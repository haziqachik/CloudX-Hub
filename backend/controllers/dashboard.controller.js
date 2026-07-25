// Render the authenticated dashboard page with the logged-in user's details.
function getDashboardPage(req, res) {
  return res.render('dashboard', {
    user: req.session.user,
  });
}

module.exports = {
  getDashboardPage,
};
