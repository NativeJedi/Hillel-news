import './index.scss';
import guardianApi from './api';
import Loader from './loader/loader';

const refreshBtn = document.getElementById('refresh_btn');
const newsList = document.getElementById('news_list');
const newsWrap = document.querySelector('.news-wrap');

const loader = new Loader(newsWrap);

async function searchNews(query = '') {
  const response = await guardianApi.get(`/search?q=${query}`);

  return response.results;
}

function renderNews(news) {
  return news
    .map(({ webTitle }) => `<li class="news-list__item">${webTitle}</li>`)
    .join('');
}

async function displayNews() {
  loader.start();

  try {
    const news = await searchNews();

    newsList.innerHTML = renderNews(news);
  } catch (e) {
    newsList.innerHTML = `<div class="error">${e.message}</div>`;
  }

  loader.stop();
}

displayNews();

refreshBtn.addEventListener('click', () => displayNews());
