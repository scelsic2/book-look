const searchInput = document.querySelector('.main-search');
const resultsContainer = document.querySelector('.results-container');
const searchIcon = document.querySelector('.search-icon');
const searchEntry = document.querySelector('.search-entry');
const entry = document.querySelector('.entry');
const listIconDiv = document.querySelector('.list-icon-div');
const listPlus = document.querySelectorAll('.list-plus');
const listRemove = document.querySelectorAll('.list-remove')
const singleTitle = document.querySelector('.single-title')
const singleAuthor = document.querySelector('.single-author')
const postError = document.querySelector('.error')
const mainSearch = document.querySelector('.main-search')
const findNextRead = document.querySelector('.find-next-read')

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
  sessionStorage.lastSearch = query;
  console.log("Book search entered.");

  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;

  searchInput.value = "";
  findNextRead.innerHTML = ""
    searchEntry.innerHTML = 
    `<h4 class="search-results-for">Search results for: ${query}</h4>`

  resultsContainer.innerHTML = 
    `<div class='loading-div'>
          <h4>Loading...</h4>
          <box-icon type='solid' name='book' color='var(--darker)' size='md' class='bx-tada' animation='tada'></box-icon>
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

        const urlParams = new URLSearchParams(window.location.search);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({ path: newUrl }, '', newUrl);

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

  const targetIcon = e.target.attributes.name.value
  const parentDiv = e.target.parentNode

  const buttonDelete = parentDiv.querySelector('.list-remove');
  const buttonAdd = parentDiv.querySelector('.list-plus')

  if (targetIcon === "plus-circle") {
    buttonDelete.classList.remove('hide')
    buttonAdd.classList.add('hide')
    
    console.log('Add book button clicked.', e.target)

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
      buttonDelete.classList.add('hide');
      buttonAdd.classList.remove('hide');
    })
    
  } else if (targetIcon === "x-circle"){
    console.log('Remove book button clicked.', e.target)
  
    const bookid = e.target.attributes.bookid.value;

    const removeDiv = parentDiv.parentNode;

    removeDiv.parentNode.removeChild(removeDiv)
    
    fetch(`/auth/user/delete/${bookid}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    // .then(postError.innerHTML = '')
    // .then(postError.innerHTML = 'Book successfully removed from list.')
    .then(removedBook => {
      console.log('Book removed from list: ', removedBook)
    })
    .catch(error => {
      console.error('Error: ', error)
      postError.innerHTML = 'Please login to manage your reading list.';
      buttonDelete.classList.remove('hide');
      buttonAdd.classList.add('hide');
    });
  }
};
 
if (listPlus != null && listRemove != null) {

    listPlus.forEach(listPlus => {
      listPlus.addEventListener('click', toggleList)
    })
    listRemove.forEach(listRemove => {
      listRemove.addEventListener('click', toggleList)
    })
  }
  

// window.onload = function() {
//   if(sessionStorage != null) {
//     if(sessionStorage.lastSearch != null && sessionStorage.lastSearch != '') {
//       searchInput.value = sessionStorage.lastSearch;
//       mainSearch.classList.add('main-search-with-text');
//       mainSearch.remove.classList('main-search')
//     } else {
//       mainSearch.classList.remove('main-search-with-text')
//       mainSearch.classList.add('main-search')
//     }
//   }
// };