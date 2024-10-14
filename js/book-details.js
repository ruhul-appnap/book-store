const bookDetailsEl = document.getElementById('book-details');
const backToListBtn = document.getElementById('back-to-list');

async function fetchBookDetails(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
}

function renderBookDetails(book) {
  bookDetailsEl.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.formats['image/jpeg']}" alt="${book.title}">
    <p><strong>Author:</strong> ${book.authors.map(author => author.name).join(', ')}</p>
    <p><strong>Genre:</strong> ${book.bookshelves.join(', ') || 'N/A'}</p>
    <p><strong>ID:</strong> ${book.id}</p>
    <p><strong>Download count:</strong> ${book.download_count}</p>
    <p><strong>Languages:</strong> ${book.languages.join(', ')}</p>
    <p><strong>Copyright:</strong> ${book.copyright ? 'Yes' : 'No'}</p>
    <h3>Available formats:</h3>
    <ul>
      ${Object.entries(book.formats).map(([format, url]) => `
        <li><a href="${url}" target="_blank">${format}</a></li>
      `).join('')}
    </ul>
    <button class="wishlist-btn" data-id="${book.id}">
      ${wishlist.includes(book.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
    </button>
  `;

  bookDetailsEl.querySelector('.wishlist-btn').addEventListener('click', (e) => {
    toggleWishlist(e.target.dataset.id);
    e.target.textContent = wishlist.includes(parseInt(e.target.dataset.id)) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist';
  });
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (bookId) {
    const book = await fetchBookDetails(bookId);
    renderBookDetails(book);
  } else {
    bookDetailsEl.innerHTML = '<p>No book selected.</p>';
  }
}

backToListBtn.addEventListener('click', () => {
  window.history.back();
});

init();