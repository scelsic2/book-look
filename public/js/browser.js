const searchInput = document.querySelector('.main-search');
const resultsContainer = document.querySelector('.results-container');
const searchIcon = document.querySelector('.search-icon');
const searchEntry = document.querySelector('.search-entry');
const entry = document.querySelector('.entry');
const listIconDiv = document.querySelector('.list-icon-div');
const listPlus = document.querySelector('.list-plus');
const listRemove = document.querySelector('.list-remove')
const singleTitle = document.querySelector('.single-title')
const singleAuthor = document.querySelector('.single-author')

let searchResults = [];

function bookSearch_keyUp(e) {
  if (e.keyCode === 13) {
    bookSearch();
  }
}

function bookSearch_click(e) {
  bookSearch();
}

function bookSearch() {
  const query = searchInput.value;
  console.log("Book search entered.");

  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;

  searchInput.value = "";

    searchEntry.innerHTML = 
    `<h4>Search results for: ${query}</h4>`

  resultsContainer.innerHTML = 
    `<div class='loading-div'>
          <h4>Loading...</h4>
          <box-icon type='solid' name='book' color='#00DFA2' size='md' class='bx-tada' animation='tada'></box-icon>
      <div class='loading-div'>
      `;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      resultsContainer.innerHTML = "";
      console.log(data.docs);
      searchResults = data.docs;
    //   const numFound = data.NumFound;
      // if (docs.length === 0) {
      //   resultsContainer.innerHTML = "No results found.";
      // }

      const docs = data.docs;
      
      const resultNumber = docs.length;
      const resultNumberP = document.createElement('p');
      resultNumberP.classList.add('result-number-p')
      resultNumberP.innerHTML = `
        Number of results: ${resultNumber}
      `;
      searchEntry.appendChild(resultNumberP)

      docs.forEach((doc) => {
        const title = doc.title;
        const author = doc.author_name ? doc.author_name[0] : "Unknown";
        const firstPublishYear = doc.first_publish_year || "Unknown";
        
        const clickableEntry = document.createElement('a');
        const resultElement = document.createElement("div");
        clickableEntry.classList.add('entry')
        resultElement.classList.add("result");
        resultElement.innerHTML = `
              <h3>${title}</h3>
              <p><strong>Author:</strong> ${author}</p>
              <p>First Published: ${firstPublishYear}</p>
          `;
        const encodedKey = encodeURIComponent(doc.key);
        clickableEntry.href = `/api/results/${encodedKey}`
        resultElement.setAttribute("key", doc.key);

        clickableEntry.appendChild(resultElement)
        resultsContainer.appendChild(clickableEntry);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// const loginIcon = document.querySelector('#login')
// const logoutIcon = document.querySelector('logout')

// if(isUserLoggedIn) {
//       loginIcon.classList.add('hide')
//       logoutIcon.classList.remove('hide')
//       console.log('User is logged in.')
// } else {
//       loginIcon.classList.remove('hide')
//       logoutIcon.classList.add('hide')
//       console.log('User is logged out.')
//   }

if(searchInput != null) { 
  searchInput.addEventListener("keyup", bookSearch_keyUp);
  searchIcon.addEventListener("click", bookSearch_click);
}

function toggleList () {
  if (listRemove.classList.contains('hide')) {
    listRemove.classList.remove('hide')
    listPlus.classList.add('hide')

    const addBook = {
      "title": singleTitle.innerHTML,
      "author": singleAuthor.innerHTML
    }

    fetch(`/auth/user/add`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(addBook),
    })
    .then(response => response.json())
    .then(addBook => {
      console.log(addBook)
    })
    .catch(error => {
      console.error('Error: ', error);
    })
    
  } else {
    listRemove.classList.add('hide')
    listPlus.classList.remove('hide')
  }
};
 
  if (listPlus != null && listRemove != null) {
    listPlus.addEventListener('click', toggleList);
    listRemove.addEventListener('click', toggleList);
  }

  // function addAsFavorite() {
  //   var stuff = { 'title': "Nick's cool book", "author": "Nick"};
  //   fetch(`/user/${userId}/addFavorite`, {
  //     method: 'POST',
  //     body: JSON.stringify(stuff),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     });

  // }