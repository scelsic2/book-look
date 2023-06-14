require('dotenv').config();
const express = require('express');
const session = require('express-session')
const { engine } = require('express-handlebars');
const PORT = process.env.PORT || 3000;
const db = require('./config/connection');

const api_routes = require('./controllers/api_routes')
const auth_routes = require('./controllers/auth_routes')


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: process.env.PORT ? true : false },
  }))

app.engine('hbs', engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/api', api_routes)
app.use('/auth', auth_routes)

app.get('/', (req, res) => {
  let isLoggedIn = false
  res.render('index', isLoggedIn);
});

db.once('open', () => {
app.listen(PORT, () => console.log('server started on port %s', PORT))
});
