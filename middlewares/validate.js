// middlewares/validate.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': `"name" должен быть текстом`,
    'string.empty': `"name" не может быть пустым`,
    'any.required': `"name" обязательно`
  }),
  email: Joi.string().email().required().messages({
    'string.email': `"email" должен быть действительным адресом`,
    'any.required': `"email" обязательно`
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `"password" должен содержать минимум 6 символов`,
    'any.required': `"password" обязательно`
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `"email" должен быть действительным адресом`,
    'any.required': `"email" обязательно`
  }),
  password: Joi.string().required().messages({
    'any.required': `"password" обязательно`
  })
});

const eventSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': `"name" не может быть пустым`,
    'any.required': `"name" обязательно`
  }),
  date: Joi.date().required().messages({
    'date.base': `"date" должен быть датой`,
    'any.required': `"date" обязательно`
  }),
  location: Joi.string().min(3).max(100).required().messages({
    'string.empty': `"location" не может быть пустым`,
    'any.required': `"location" обязательно`
  }),
  description: Joi.string().max(500).allow('', null)
});

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': `"name" не может быть пустым`,
    'any.required': `"name" обязательно`
  }),
  email: Joi.string().email().required().messages({
    'string.email': `"email" должен быть действительным адресом`,
    'any.required': `"email" обязательно`
  })
});

exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateEvent = (req, res, next) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
