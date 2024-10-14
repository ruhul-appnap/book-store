let currentPage = 1;
let totalPages = 1;
let currentBooks = [];

const booksListEl = document.getElementById('books-list');
const searchEl = document.getElementById('search');
const genreFilterEl = document.getElementById('genre-filter');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbersEl = document.getElementById('page-numbers');

async function fetchBooks(page = 1, search = '', genre = '') {
  const response = await fetch(`${API_URL}?page=${page}&search=${search}&topic=${genre}`);
  const data = await response.json();
  currentBooks = data.results;
  totalPages = Math.ceil(data.count / 32);
  return data;
}

function renderBooks(books) {
  booksListEl.innerHTML = '';
  books.forEach(book => {
    booksListEl.appendChild(createBookCard(book));
  });
}

function updatePagination() {
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  pageNumbersEl.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.classList.toggle('active', i === currentPage);
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        updateBooks();
      });
      pageNumbersEl.appendChild(pageBtn);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      pageNumbersEl.appendChild(ellipsis);
    }
  }
}

async function updateBooks() {
  const data = await fetchBooks(currentPage, searchEl.value, genreFilterEl.value);
  renderBooks(data.results);
  updatePagination();
}

function  debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

searchEl.addEventListener('input', debounce(() => {
  currentPage = 1;
  updateBooks();
}, 300));

genreFilterEl.addEventListener('change', () => {
  currentPage = 1;
  updateBooks();
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateBooks();
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    updateBooks();
  }
});

async function init() {
  const data = await fetchBooks();
  renderBooks(data.results);
  updatePagination();

  const genres = [...new Set(data.results.flatMap(book => book.bookshelves))].sort();
  genreFilterEl.innerHTML += genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
}

init();