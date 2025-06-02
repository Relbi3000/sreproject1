const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Форма регистрации
exports.registerForm = (req, res) => {
  res.render('register', { title: 'Регистрация' });
};

// Регистрация пользователя
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/users/login');
  } catch (err) {
    next(err);
  }
};

// Форма входа
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Вход' });
};

// Вход пользователя с генерацией JWT, включающей поле role
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send('Неверные учетные данные');
    }
    const token = jwt.sign(
      { id: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/events');
  } catch (err) {
    next(err);
  }
};

// Получение профиля пользователя (приватный эндпоинт)
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).send('Пользователь не найден');
    res.render('profile', { title: 'Мой профиль', user });
  } catch (err) {
    next(err);
  }
};

// Обновление профиля пользователя (приватный эндпоинт)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-password');
    res.render('profile', { title: 'Мой профиль', user, message: 'Профиль обновлён' });
  } catch (err) {
    next(err);
  }
};
