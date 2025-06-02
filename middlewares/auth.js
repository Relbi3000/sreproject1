const jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Token отсутствует. Пользователь не авторизован.');
    return res.redirect('/users/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded содержит { id, role, ... }
    next();
  } catch (err) {
    console.log('Ошибка проверки токена:', err.message);
    res.clearCookie('token');
    return res.redirect('/users/login');
  }
};
