const router = require('express').Router();

// Get one book
router.get('/results/:key', async (req, res)=> {

let query = req.params.key;

  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;

  console.log(apiUrl);

  let response = {
    "title": "Not found",
    "key": ""
};

  await fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
    //   const numFound = data.NumFound;
      // if (docs.length === 0) {
      //   resultsContainer.innerHTML = "No results found.";
      // }

      const docs = data.docs;
      docs.every((doc) => {

        console.log(' testing ', doc.key, req.params.key);

        if(doc.key == req.params.key) {

            console.log('found match')

            response.title = doc.title
            response.author = doc.author_name
            response.subject = doc.subject
            response.key = doc.key;
            return false;
        }
      });
      console.log(response)
      res.render('results', response);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

})

// Add book to list
// router.post('/results/:key', async (req, res) => {
//   try 
//   {const {
//     title,
//     author
//   } = req.body;

//   const addBook = new Book ({
//     title,
//     author
//   })

//   const addedBook = await newBook.save()

//   res.status(201).json(addedBook);
//   } catch (error) {
//     res.status(500).json({ error: 
//       'Book was not added to list.'
//     })
//   }
// })

router.get('/list/:id', async(req, res) => {
  res.render('list')
})

module.exports = router;