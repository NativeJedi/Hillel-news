import $ from 'jquery';
import './index.scss';
import Loader from './components/loader/loader';
import Pagination from './components/pagination/pagination';
import { searchNews, getNewsItem } from './requests';

const refreshBtn = $('#refresh_btn');
const newsList = $('#news_list');
const newsWrap = $('.news-wrap');

const loader = new Loader(newsWrap[0]);

function renderNews(news) {
  return news
    .map(({ webTitle, id, webUrl }) => `
      <li class="news-list__item" data-id="${id}" data-url="${webUrl}">
        <h4 class="news-list__title">${webTitle}</h4>
      </li>
    `)
    .join('');
}

async function displayNews(page = 1) {
  loader.start();

  try {
    const response = await searchNews(page);
    const { total, currentPage, results } = response;

    newsList.html(renderNews(results));

    return { total, currentPage };
  } catch (e) {
    newsList.html(`<div class="error">${e.message}</div>`);
    return { total: 0, currentPage: 0 };
  } finally {
    loader.stop();
  }
}

async function getNewsBody(newsItem) {
  const { id, url } = newsItem.dataset;

  const content = await getNewsItem(id);

  const { body } = content.fields;

  const newsBody = document.createElement('div');
  newsBody.classList.add('news-body');
  newsBody.style.display = 'none';
  newsBody.innerHTML = `
    <div class="news-body__main">${body}</div>
    <a class="news-body__link" href="${url}">Read full news</a>
  `;

  return newsBody;
}

(async function () {
  const { total, currentPage } = await displayNews();

  const pagination = new Pagination(
    total,
    currentPage,
    newsWrap,
  );

  pagination.onInput = (page) => displayNews(page);

  refreshBtn.on('click', async () => {
    const { total: totalPages, currentPage: page } = await displayNews();

    pagination.total = totalPages;
    pagination.currentPage = page;
    pagination.render();
  });

  newsList.on('click', async (e) => {
    const newsTitle = e.target.closest('.news-list__title');

    if (!newsTitle) {
      return;
    }

    const newsItem = newsTitle.closest('.news-list__item');
    const newsBody = $(newsItem).find('.news-body')[0];

    if (newsBody) {
      $(newsBody).slideToggle();
      return;
    }

    const addedBody = await getNewsBody(newsItem);
    newsItem.insertAdjacentElement('beforeend', addedBody);

    $(addedBody).slideToggle();
  });
}());
