const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registrationForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).send('Событие не найдено');
    // Передаем информацию об авторизованном пользователе из req.user
    res.render('registration', { title: 'Регистрация на событие', event, user: req.user });
  } catch (err) {
    res.status(400).send('Ошибка: ' + err.message);
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    // Берем userId из req.user, установленного middleware
    const userId = req.user.id;
    const eventId = req.params.eventId;
    
    const registration = new Registration({
      event: eventId,
      user: userId
    });
    await registration.save();

    // Добавляем участника в событие
    await Event.findByIdAndUpdate(eventId, {
      $push: { participants: { userId, status: 'registered' } }
    });
    
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    res.status(400).send('Ошибка при регистрации: ' + err.message);
  }
};
