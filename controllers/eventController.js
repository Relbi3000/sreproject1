const Event = require('../models/Event');

// Получение списка событий (публично)
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render('index', { title: 'События', events });
  } catch (err) {
    next(err);
  }
};

// Форма добавления события (только для авторизованных пользователей)
exports.addEventForm = (req, res) => {
  res.render('add-event', { title: 'Добавить событие' });
};

// Создание нового события (устанавливаем поле creator из req.user)
exports.createEvent = async (req, res, next) => {
  try {
    const { name, date, location, description } = req.body;
    const creator = req.user.id; // ensureAuth гарантирует наличие req.user
    const event = new Event({ name, date, location, description, creator });
    await event.save();
    res.redirect('/events');
  } catch (err) {
    next(err);
  }
};

// Детальный просмотр события (публично)
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.userId', 'name'); // выбираем только поле name у участников
    if (!event) return res.status(404).send('Событие не найдено');
    res.render('event-details', { title: event.name, event });
  } catch (err) {
    next(err);
  }
};

// Форма редактирования события (только для создателя или admin)
exports.editEventForm = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Событие не найдено');

    // Логирование для отладки
    console.log("Редактирование события:");
    console.log("event.creator:", event.creator.toString());
    console.log("req.user:", req.user);

    // Проверка: только создатель или пользователь с ролью "admin" может редактировать событие
    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Доступ запрещён: вы не являетесь создателем этого события');
    }
    res.render('edit-event', { title: 'Редактировать событие', event });
  } catch (err) {
    next(err);
  }
};

// Обновление события (только для создателя или admin)
exports.updateEvent = async (req, res, next) => {
  try {
    const { name, date, location, description } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Событие не найдено');

    // Логирование для отладки
    console.log("Обновление события:");
    console.log("event.creator:", event.creator.toString());
    console.log("req.user:", req.user);

    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Доступ запрещён: вы не являетесь создателем этого события');
    }
    await Event.findByIdAndUpdate(req.params.id, { name, date, location, description });
    res.redirect('/events');
  } catch (err) {
    next(err);
  }
};

// Удаление события (только для создателя или admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Событие не найдено');

    // Логирование для отладки
    console.log("Удаление события:");
    console.log("event.creator:", event.creator.toString());
    console.log("req.user:", req.user);

    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Доступ запрещён: вы не являетесь создателем этого события');
    }
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/events');
  } catch (err) {
    next(err);
  }
};

// Получение статистики по событиям (количество участников)
exports.getEventStats = async (req, res, next) => {
  try {
    const stats = await Event.aggregate([
      {
        $project: {
          name: 1,
          participantCount: { $size: { $ifNull: ["$participants", []] } }
        }
      }
    ]);
    res.render('stats', { title: 'Статистика', stats });
  } catch (err) {
    next(err);
  }
};
