import axios from 'axios';
import Notiflix from 'notiflix';
import { displayImages } from './index.js';

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
