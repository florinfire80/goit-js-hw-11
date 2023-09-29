import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '39735160-014c6c17620a2b57de6626257';

// Funcția pentru căutare imagini

export async function searchImages(query, page = 1) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    const images = data.hits;
    const totalHits = data.totalHits; // Numărul total de imagini

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return { images, totalHits };
  } catch (error) {
    console.error('Error fetching data from Pixabay API:', error);
    throw error; // Aruncă eroarea pentru a fi gestionată ulterior în cod
  }
}

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
