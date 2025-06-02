require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const jwt = require('jsonwebtoken');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

const app = express();
const PORT = process.env.PORT || 3000;

// Защита HTTP-заголовков
app.use(helmet());
// Защита от NoSQL-инъекций
app.use(mongoSanitize());

// Ограничение количества запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Логирование запросов
app.use(morgan('dev'));

// Парсинг тела запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Подключение cookie-parser для работы с cookie
app.use(cookieParser());

// Подключение method-override (используем параметр _method для имитации PUT и DELETE)
app.use(methodOverride('_method'));

// Middleware для передачи данных авторизованного пользователя в шаблоны
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Настройка EJS с layout
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Маршруты
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/registrations', registrationRoutes);

// Маршрут для Logout
app.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.redirect('/users/login');
});

// Главная страница – перенаправление на события
app.get('/', (req, res) => {
  res.redirect('/events');
});

// Метрики для Prometheus
collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Длительность HTTP-запросов в секундах',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Общее количество HTTP-запросов',
  labelNames: ['method', 'route', 'code']
});

// Middleware для сбора метрик по каждому запросу
app.use((req, res, next) => {
  const startEpoch = Date.now();
  res.on('finish', () => {
    const responseTimeInSeconds = (Date.now() - startEpoch) / 1000;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(responseTimeInSeconds);
    httpRequestsTotal
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .inc();
  });
  next();
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.get('/error', (req, res) => res.status(500).send('Test error'));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
