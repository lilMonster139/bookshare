
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;


const users = {};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'секрет_для_сессии',
  resave: false,
  saveUninitialized: false,
}));


app.use(express.static('public'));


app.post('register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).send('Пользователь уже существует');
  }
  users[username] = { username, password };
  res.send('Регистрация успешна');
});


app.post('login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(400).send('Неверный логин или пароль');
  }
  req.session.user = user;
  res.send('Вход успешен');
});


app.get('profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Пожалуйста, войдите');
  }
  res.send(`Добро пожаловать, ${req.session.user.username}!`);
});


app.post('logout', (req, res) => {
  req.session.destroy();
  res.send('Вы вышли из системы');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


app.use(session({
  secret: 'секрет_для_сессии',  
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, 
  }
}));

