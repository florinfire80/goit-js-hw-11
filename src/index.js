import { searchImages } from './pixabay-api.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

// Funcția pentru afișarea imaginilor
function displayImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = image.webformatURL;
    img.alt = image.tags;

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}

// Funcția pentru gestionarea căutării
function handleSearch(event) {
  event.preventDefault();
  gallery.innerHTML = ''; // Șterge imaginile existente din galerie
  currentQuery = form.searchQuery.value.trim(); // Obține valoarea căutării
  currentPage = 1; // Resetează pagina la 1 pentru o nouă căutare

  // Ascunde butonul "Load more" după o nouă căutare
  loadMoreButton.style.display = 'none';

  // Apelează funcția searchImages pentru a efectua căutarea
  searchImages(currentQuery, currentPage);
}

// Adaugă eveniment pentru formularul de căutare
form.addEventListener('submit', handleSearch);

// Funcția pentru gestionarea încărcării suplimentare
function handleLoadMore() {
  currentPage += 1; // Incrementăm pagina pentru încărcare suplimentară
  searchImages(currentQuery, currentPage);

  // Afișează butonul "Load more" după solicitarea de încărcare suplimentară
  loadMoreButton.style.display = 'block';
}

// Adaugă eveniment pentru butonul "Load more"
loadMoreButton.addEventListener('click', handleLoadMore);
