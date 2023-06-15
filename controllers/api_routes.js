const router = require('express').Router();

// Get one book
router.get('/results/:key', async (req, res)=> {

let query = req.params.key;
let isLoggedIn = false

  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;

  console.log('apiURL: ' + apiUrl);

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

        console.log('doc.key: '+ doc.key, + 'req.params: ' + req.params.key);

        if(doc.key == req.params.key) {

            console.log('found match')

            const userId = req.session.user_id
             if(!userId) {
                isLoggedIn = false
              } else {
                isLoggedIn = true
              }

            response.doc = doc  
            response.title = doc.title
            response.author = doc.author_name
            response.subject = doc.subject
            response.key = doc.key
            response.isLoggedIn = isLoggedIn
            response.userId = userId
            return false;
        }
      });
      console.log('Response from router.get one book at key is below:')
      console.log(response)
      console.log('req.session is below:')
      console.log(req.session)
      console.log('req.session.userId is below:')
      console.log(req.session.user_id)

      

      res.render('results', response);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

})

module.exports = router;