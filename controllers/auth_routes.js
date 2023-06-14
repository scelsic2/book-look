const router = require('express').Router();
const User = require('../models/User')
const Book = require('../models/Book')

let isLoggedIn = false

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body)
        req.session.user_id = user._id;
        
        if(user) {
          isLoggedIn = true  
        } else {
            isLoggedIn = false
        }

        console.log('Router.post user: ' + user);
        // res.send({user})

        res.redirect(`/auth/user/${user._id}`)

        // res.render('list', {
        //     user: user,
        //     isLoggedIn: isLoggedIn
        // })

    } catch (err) {
        res.render('register', { error: 'A user with this email already exists.' });
    }
})

router.get('/login', async(req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) return res.redirect('/auth/register')

    // if (!user) return res.status(402).send({error: 'A user with that email is not found.'});

    const validPassword = await user.validatePass(req.body.password)

    if (!validPassword) return res.render('login', { error: 'Email and password do not match.' });

    // if (!validPassword) return res.status(401).send({error: 'Email address and password do not match.'})

    if(user) {
        isLoggedIn = true  
      } else {
          isLoggedIn = false
      }

    req.session.user_id = user._id
    console.log('Router.post login: ' + user)
    // res.send({user})

    res.redirect(`/auth/user/${user._id}`)
})

router.get('/user/', async(req, res) => {
    res.render('login')
})

router.get('/user/:id', async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId).populate('email');
      
        if(user) {
            isLoggedIn = true  
        } else {
            isLoggedIn = false
        }

      if (!user) return res.redirect('/auth/login')

        if (!user) console.log('No user')   

        console.log('Router.get user at id: ' + user)
        console.log('req.session from my reading list page is below:')
        console.log(req.session)
        const email = user.email
        const atIndex = email.indexOf('@')
        const username = email.substring(0, atIndex)

      res.render('list', { 
        id: userId,
        username: username,
        isLoggedIn: isLoggedIn
    });

    } catch (err) {
      res.status(500).json({ error: 'An error occurred while fetching the user information.' });
    }
});

router.post('/user/:id', async (req, res) => {
    const addBook = Book.create(res.body)
    console.log('Router.post user/:id: ' + addBook)
})

router.get('/home/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).populate('_id')

        if(user) {
            isLoggedIn = true  
        } else {
            isLoggedIn = false
        }
        res.render('index', {
            user: user,
            userId: userId,
            isLoggedIn: isLoggedIn
        })
    } catch (err) {
        res.status(500).json({ error: 'Another error occurred while fetching home by user id.' });
      }
})

router.get(`/api/results/:key`, async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).populate('_id')

        const foundBook = res.body
        console.log('help me')

    } catch (err) {
        res.status(500).json({ error: 'Your get route for result does not work.' });
      }
})

router.get('/logout', (req, res)=> {
    req.session.destroy()
    isLoggedIn = false
    res.redirect('/')
    console.log('User logged out.')
})

module.exports = router;