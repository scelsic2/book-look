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
      //const userId = req.params.id;
      const userId = req.session.user_id;
      const user = await User.findById(userId).populate('list');
      
        if(user) {
            isLoggedIn = true  
        } else {
            isLoggedIn = false
        }

      if (!user) return res.redirect('/auth/login')

        if (!user) console.log('No user')   

        console.log('Router.get user at id: ' + user._id)
        console.log('req.session from my reading list page is below:')
        console.log(req.session)
        const email = user.email
        const atIndex = email.indexOf('@')
        const username = email.substring(0, atIndex)

        const list = user.list.map((list) => list.toObject())

      res.render('list', { 
        id: userId,
        username: username,
        isLoggedIn: isLoggedIn,
        list: list
    });

    } catch (err) {
      res.status(500).json({ error: 'An error occurred while fetching the user information.' });
    }
});

router.post('/user/add', async (req, res) => {
    const userId = req.session.user_id;
  
    console.log(`req.body from post book is below:`)
    console.log(req.body)
    
    const addedBook = {
        userId: userId,
        title: req.body.title,
        author: req.body.author
    }
    try {

        const user = await User.findById(userId);

        if(!user) {
            return res.render('results', { error: 'Please login to add a book to your reading list.' });
        }

        const book = await Book.create(addedBook);
        console.log('Book added to list: ', book);

        res.json(book);

        user.list.push(book)

        await user.save()

      } catch (error) {
        console.error('Error adding book to list: ', error);
        res.status(500).json({ error: 'An error occurred while adding book to list.' });
      }
  });

router.delete('/user/delete/:bookId', async (req, res) => {
    const userId = req.session.user_id;
    console.log('User Id: ' + userId)
    const bookId = req.params.bookId;
    console.log('Book Id: ' + bookId)

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.'})
        }

        console.log(' user books ', user.list )

        const bookIndex = user.list.findIndex(book => `new ObjectId("${book._id}")` === `new ObjectId("${bookId}")`)

        if (bookIndex === -1) {
            return res.status(404).json({ error: 'This book was not found on your list.'})
        }

        const removedBook = user.list.splice(bookIndex, 1)[0];
        await user.save();

        res.json(removedBook);
    } catch (error) {
        console.error('Error removing book from list: ', error);
        res.status(500).json({ error: 'An error occurred while removing book from the list.'})
    }
})
  
router.get('/home/:id', async (req, res) => {
    try {
        const userId = req.session.user_id;

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

router.get('/logout', (req, res)=> {
    req.session.destroy()
    isLoggedIn = false
    res.redirect('/')
    console.log('User logged out.')
})


module.exports = router;