// dashboardController.js
const panel = (req, res) => {
  res.json({ message: 'Bienvenido al panel de administrador' });
};

module.exports = {
  panel,
};
