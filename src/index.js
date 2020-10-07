import $ from 'jquery';
import './index.scss';
import Loader from './components/loader/loader';
import Pagination from './components/pagination/pagination';
import { getNewsItem, searchNews } from './requests';

const refreshBtn = $('#refresh_btn');
const newsList = $('#news_list');
const newsWrap = $('.news-wrap');

const loader = new Loader(newsWrap[0]);

function renderNews(news) {
  return news
    .map(({ webTitle, id, webUrl }) => `
      <li class="news-list__item" data-id="${id}" data-url="${webUrl}">
        <div class="news-list__header">
          <h4 class="news-list__title">${webTitle}</h4>
          <span class="news-list__header-icon">&#10095;</span>
        </div>
      </li>
    `)
    .join('');
}

async function displayNews(page = 1) {
  loader.start();

  try {
    const { currentPage, pages, results } = await searchNews(page);

    newsList.html(renderNews(results));

    return { currentPage, pages };
  } catch (e) {
    newsList.html(`<div class="error">${e.message}</div>`);

    return { currentPage: 1, pages: 1 };
  } finally {
    loader.stop();
  }
}

(async function () {
  const { currentPage, pages } = await displayNews();

  const pagination = new Pagination(currentPage, pages, newsWrap[0]);
  pagination.onChange = (page) => displayNews(page);

  console.log(pagination);
  $('.news-list').on('click', async (e) => {
    const newsItem = e.target.closest('.news-list__item');
    const newsLink = e.target.closest('.news-body__link');

    if (!newsItem || newsLink) {
      return;
    }

    newsItem.classList.toggle('is-active');

    const newsBody = $(newsItem).find('.news-body')[0];

    if (newsBody) {
      $(newsBody).slideToggle();
      return;
    }

    const { id, url } = newsItem.dataset;

    const response = await getNewsItem(id);
    const { body } = response.fields;

    newsItem.insertAdjacentHTML('beforeend', `
      <div class="news-body" style="display: none;">
        <div class="news-body__main">${body}</div>
        <a class="news-body__link" href="${url}" target="_blank">Read full news</a>
      </div>
    `);

    const addedBody = $(newsItem).find('.news-body')[0];
    $(addedBody).slideDown();
  });

  refreshBtn.on('click', () => displayNews());
}());
