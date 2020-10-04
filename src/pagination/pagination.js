import './pagination.scss';
import $ from 'jquery';

export default class Pagination {
  #currentPage = 1;

  get currentPage() {
    return this.#currentPage;
  }

  set currentPage(page) {
    const pageNum = Number(page);

    if (!pageNum || pageNum < 1) {
      this.#currentPage = 1;
      return;
    }

    if (pageNum > this.totalPages) {
      this.#currentPage = this.totalPages;
      return;
    }

    this.#currentPage = pageNum;
  }

  constructor(pages, currentPage, target, onInput) {
    this.totalPages = pages;
    this.currentPage = currentPage;
    this.target = target;
    this.onInput = onInput || function defaultInput() {};
    this.render();
  }

  async handlePageChange(page) {
    const { currentPage, pages } = await this.onInput(page);
    this.currentPage = currentPage;
    this.totalPages = pages;
    this.render();
  }

  render() {
    const markup = `
      <div class="pagination">
        <button class="pagination__btn pagination__btn--prev">Prev</button>
        <div class="pagination__input-wrap">
          <input class="pagination__input" type="text" value="${this.currentPage}">
          <span class="pagination__count">of ${this.totalPages}</span>
        </div>
        <button class="pagination__btn pagination__btn--next">Next</button>
      </div>
    `;

    $(this.target).find('.pagination').remove();
    $(this.target).append(markup);

    $('.pagination__input').on('blur', (e) => this.handlePageChange(e.target.value));
    $('.pagination__btn--next').on('click', () => {
      this.currentPage += 1;

      this.handlePageChange(this.currentPage);
    });

    $('.pagination__btn--prev').on('click', () => {
      this.currentPage -= 1;

      this.handlePageChange(this.currentPage);
    });
  }
}
