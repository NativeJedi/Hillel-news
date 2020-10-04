import $ from 'jquery';
import './index.scss';
import Loader from './loader/loader';
import Pagination from './pagination/pagination';
import { searchNews, getNewsItem } from './requests';

const refreshBtn = $('#refresh_btn');
const newsList = $('#news_list');
const newsWrap = $('.news-wrap');

const loader = new Loader(newsWrap[0]);

function renderNews(news) {
  return news
    .map(({ webTitle, id }) => `
      <li class="news-list__item" data-id="${id}">
        <h4 class="news-list__title">${webTitle}</h4>
      </li>
    `)
    .join('');
}

async function displayNews() {
  loader.start();

  try {
    const response = await searchNews();
    const { total, currentPage, results } = response;

    const pagination = new Pagination(total, currentPage, newsWrap);
    pagination.onInput = (page) => searchNews(page);

    newsList.html(renderNews(results));
  } catch (e) {
    newsList.html(`<div class="error">${e.message}</div>`);
  }

  loader.stop();
}

displayNews();

refreshBtn.on('click', () => displayNews());

newsList.on('click', async (e) => {
  const newsTitle = e.target.closest('.news-list__title');

  if (!newsTitle) {
    return;
  }

  const newsItem = newsTitle.closest('.news-list__item');

  const getNewsBody = () => $(newsItem).find('.news-list__body')[0];
  const newsBody = getNewsBody();

  if (newsBody) {
    $(newsBody).slideToggle();
    return;
  }

  const { id } = newsItem.dataset;

  const content = await getNewsItem(id);

  const { body } = content.fields;

  newsItem.insertAdjacentHTML('beforeend', `
    <div class="news-list__body" style="display: none">${body}</div>
  `);

  const addedBody = getNewsBody();

  $(addedBody).slideToggle();
});
