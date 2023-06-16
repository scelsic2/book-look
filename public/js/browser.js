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
const postError = document.querySelector('.error')

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
    `<h4 class="search-results-for">Search results for: ${query}</h4>`

  resultsContainer.innerHTML = 
    `<div class='loading-div'>
          <h4>Loading...</h4>
          <box-icon type='solid' name='book' color='var(--darkest)' size='md' class='bx-tada' animation='tada'></box-icon>
      <div class='loading-div'>
      `;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      resultsContainer.innerHTML = "";
      console.log(data.docs);
      searchResults = data.docs;

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
        const author = doc.author_name[0]

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

if(searchInput != null) { 
  searchInput.addEventListener("keyup", bookSearch_keyUp);
  searchIcon.addEventListener("click", bookSearch_click);
}

function toggleList (e) {
  if (listRemove.classList.contains('hide')) {
    listRemove.classList.remove('hide')
    listPlus.classList.add('hide')
  
    const parentDiv = e.target.parentNode
  
    const buttonDelete = parentDiv.querySelector('.list-remove');

    console.log('Add book clicked.')

    const addBook = {
      "title": singleTitle.innerHTML,
      "author": singleAuthor.innerHTML
    };

    fetch(`/auth/user/add`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(addBook),
    })
    .then(response => response.json())
    .then((bookResponse) => {
      console.log(bookResponse);
      buttonDelete.setAttribute('bookId', bookResponse._id);
    })
    .then(postError.innerHTML = 'Book successfully added to list.')
    .catch((error) => {
      console.error('Error: ', error);
      postError.innerHTML = 'Please login to add a book to your reading list.';
      listRemove.classList.add('hide');
      listPlus.classList.remove('hide');
    })
    
  } else {
    listRemove.classList.add('hide')
    listPlus.classList.remove('hide')

    console.log('Remove book clicked.', e.target)
  
    const bookid = e.target.attributes.bookid.value;
    
    fetch(`/auth/user/delete/${bookid}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(postError.innerHTML = '')
    .then(postError.innerHTML = 'Book successfully removed from list.')
    .then(removedBook => {
      console.log('Book removed from list: ', removedBook)
    })
    .catch(error => {
      console.error('Error: ', error)
    });
  }
};
 
  if (listPlus != null && listRemove != null) {
    listPlus.addEventListener('click', toggleList);
    listRemove.addEventListener('click', toggleList);
  }