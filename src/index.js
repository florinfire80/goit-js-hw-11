import Notiflix from 'notiflix';
import { searchImages } from './pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
let currentQuery = '';

const observer = new IntersectionObserver(handleLoadMore, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
});

// Funcția pentru afișarea imaginilor
export function displayImages(images, gallery) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const imgLink = document.createElement('a'); // Creează un link pentru imagine
    imgLink.href = image.largeImageURL; // Setează URL-ul imaginii mari

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = image.webformatURL;
    img.alt = image.tags;

    imgLink.appendChild(img); // Adaugă imaginea în link

    const info = document.createElement('div');
    info.classList.add('info');

    const propertiesContainer = document.createElement('div');
    propertiesContainer.classList.add('info-properties');

    const valuesContainer = document.createElement('div');
    valuesContainer.classList.add('info-values');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes</b>`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views</b>`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments</b>`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads</b>`;

    const likesValue = document.createElement('p');
    likesValue.classList.add('info-value');
    likesValue.innerText = image.likes;

    const viewsValue = document.createElement('p');
    viewsValue.classList.add('info-value');
    viewsValue.innerText = image.views;

    const commentsValue = document.createElement('p');
    commentsValue.classList.add('info-value');
    commentsValue.innerText = image.comments;

    const downloadsValue = document.createElement('p');
    downloadsValue.classList.add('info-value');
    downloadsValue.innerText = image.downloads;

    propertiesContainer.appendChild(likes);
    propertiesContainer.appendChild(views);
    propertiesContainer.appendChild(comments);
    propertiesContainer.appendChild(downloads);

    valuesContainer.appendChild(likesValue);
    valuesContainer.appendChild(viewsValue);
    valuesContainer.appendChild(commentsValue);
    valuesContainer.appendChild(downloadsValue);

    info.appendChild(propertiesContainer);
    info.appendChild(valuesContainer);

    photoCard.appendChild(imgLink); // Adaugă linkul cu imaginea
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });

  // Inițializeaza SimpleLightbox pentru galerie
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  // Refresh la Lightbox pentru a include noile imagini
  lightbox.refresh();
}

// Funcția pentru gestionarea căutării
async function handleSearch(event) {
  event.preventDefault();

  // Obține valoarea din câmpul de input
  const searchQuery = form.searchQuery.value.trim();

  // Verifica dacă câmpul de input este gol
  if (!searchQuery) {
    console.error('Please enter a search query.');
    return; // Nu face solicitarea către API dacă câmpul este gol
  }

  gallery.innerHTML = ''; // Șterge imaginile existente din galerie
  currentQuery = form.searchQuery.value.trim(); // Obține valoarea căutării
  currentPage = 1; // Resetează pagina la 1 pentru o nouă căutare

  try {
    const { images, totalHits } = await searchImages(
      currentQuery,
      currentPage,
      gallery
    );

    if (images.length > 0) {
      // Afiseaza mesajul doar daca exista cel putin o imagine
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (images.length > 0 && totalHits > images.length) {
      observer.observe(document.querySelector('.photo-card:last-child'));
    }
  } catch (error) {
    console.error('Error searching for images:', error);
  }
}

// Adaugă eveniment pentru formularul de căutare
form.addEventListener('submit', handleSearch);

// Funcția pentru gestionarea încărcării suplimentare
async function handleLoadMore(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1; // Incrementăm pagina pentru încărcare suplimentară

      searchImages(currentQuery, currentPage, gallery)
        .then(({ images, totalHits }) => {
          if (images.length > 0) {
            displayImages(images);
          }

          if (totalHits <= currentPage * 40) {
            observer.unobserve(entry.target);
          }
        })
        .catch(error => {
          console.error('Error loading more images:', error);
        });
    }
  });
}
