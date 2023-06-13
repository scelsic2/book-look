const router = require('express').Router();
const User = require('../models/User')

let isLoggedIn = false

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body)
        req.session.user_id = user._id;
        
        if(user._id) {
          isLoggedIn = true  
        } else {
            isLoggedIn = false
        }

        console.log({user});
        // res.send({user})
        res.render('list', {
            user: user,
            isLoggedIn: isLoggedIn
        })
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

    if(user._id) {
        isLoggedIn = true  
      } else {
          isLoggedIn = false
      }

    if (!user) return res.status(402).send({error: 'A user with that email is not found.'});

    const validPassword = await user.validatePass(req.body.password)

    if (!validPassword) return res.status(401).send({error: 'Email address and password do not match.'})

    req.session.user_id = user._id
    console.log({user})
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
      
        if(userId) {
            isLoggedIn = true  
        } else {
            isLoggedIn = false
        }

      if (!user) return res.redirect('/auth/login')

      if (!user) console.log('No user')

        console.log('Router.get user: ' + user)
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

router.get('/home/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).populate('_id')

        if(userId) {
            isLoggedIn = true  
        } else {
            isLoggedIn = false
        }
        res.render('index', {
            user: user,
            isLoggedIn: isLoggedIn
        })
    } catch (err) {
        res.status(500).json({ error: 'Another error occurred while fetching home by user id.' });
      }
})

router.get('/logout', (req, res)=> {
    req.session.destroy()
    isLoggedIn = false
    res.redirect('/')
    console.log('User logged out.')
})

module.exports = router;