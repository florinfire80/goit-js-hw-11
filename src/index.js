import Notiflix from 'notiflix';
import { searchImages } from './pixabay-api.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
let currentQuery = '';

const observer = new IntersectionObserver(handleLoadMore, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
});

// Funcția pentru gestionarea căutării
async function handleSearch(event) {
  event.preventDefault();

  // Obțineți valoarea din câmpul de input
  const searchQuery = form.searchQuery.value.trim();

  // Verificați dacă câmpul de input este gol
  if (!searchQuery) {
    // Afișați un mesaj de eroare sau faceți altă acțiune corespunzătoare
    console.error('Please enter a search query.');
    return; // Nu faceți solicitarea către API dacă câmpul este gol
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
      // Afisati mesajul doar daca exista cel putin o imagine
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
