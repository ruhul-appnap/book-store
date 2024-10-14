const wishlistBooksEl = document.getElementById('wishlist-books');

async function fetchWishlistBooks() {
  const books = [];
  for (const id of wishlist) {
    const response = await fetch(`${API_URL}/${id}`);
    const book = await response.json();
    books.push(book);
  }
  return books;
}

function renderWishlist(books) {
  wishlistBooksEl.innerHTML = '';
  books.forEach(book => {
    wishlistBooksEl.appendChild(createBookCard(book));
  });
}

async function init() {
  const books = await fetchWishlistBooks();
  renderWishlist(books);
}

init();