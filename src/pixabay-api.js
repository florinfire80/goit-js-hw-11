import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39735160-014c6c17620a2b57de6626257';

// Funcția pentru căutare imagini

export async function searchImages(query, page = 1, gallery) {
  const perPage = 40; // Numărul de imagini pe pagină
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    const images = data.hits;
    const totalHits = data.totalHits; // Numărul total de imagini

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      // Aici se apelează funcția displayImages pentru a afișa imaginile în galerie
      displayImages(images, gallery);
    }

    return { images, totalHits, currentPage: page };
  } catch (error) {
    console.error('Error fetching data from Pixabay API:', error);
    throw error; // Aruncă eroarea pentru a fi gestionată ulterior în cod
  }
}

// Funcția pentru afișarea imaginilor
function displayImages(images, gallery) {
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

  // Inițializați SimpleLightbox pentru galeria dvs.
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  // Refresh la Lightbox pentru a include noile imagini
  lightbox.refresh();
}
