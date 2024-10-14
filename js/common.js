const API_URL = 'https://gutendex.com/books';
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function toggleWishlist(bookId) {
  bookId = parseInt(bookId);
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter(id => id !== bookId);
  } else {
    wishlist.push(bookId);
  }
  saveWishlist();
}

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.innerHTML = `
    <img src="${book.formats['image/jpeg']}" alt="${book.title}">
    <div class="book-info">
      <h3>${book.title}</h3>
      <p>Author: ${book.authors.map(author => author.name).join(', ')}</p>
      <p>Genre: ${book.bookshelves.join(', ') || 'N/A'}</p>
      <p>ID: ${book.id}</p>
    </div>
    <button class="wishlist-btn" data-id="${book.id}">
      ${wishlist.includes(book.id) ? '❤️' : '🤍'}
    </button>
  `;

  card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWishlist(e.target.dataset.id);
    e.target.textContent = wishlist.includes(parseInt(e.target.dataset.id)) ? '❤️' : '🤍';
  });

  card.addEventListener('click', () => {
    window.location.href = `book-details.html?id=${book.id}`;
  });

  return card;
}