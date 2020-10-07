import './pagination.scss';
import $ from 'jquery';

export default class Pagination {
  #currentPage = 1;

  total = 1;

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
      this.#currentPage = this.total;
      return;
    }

    this.#currentPage = pageNum;
  }

  constructor(total, currentPage, target, onInput) {
    this.total = total;
    this.currentPage = currentPage;
    this.target = target;
    this.onInput = onInput || function defaultInput() {};
    this.render();
  }

  async handlePageChange(page) {
    const { currentPage, total } = await this.onInput(page);
    this.currentPage = currentPage;
    this.total = total;
    this.render();
  }

  render() {
    const markup = `
      <div class="pagination">
        <button class="pagination__btn pagination__btn--prev">&#10094;</button>
        <div class="pagination__input-wrap">
          <input class="pagination__input" type="text" value="${this.currentPage}">
          <span class="pagination__count">of ${this.total}</span>
        </div>
        <button class="pagination__btn pagination__btn--next">&#10095;</button>
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
