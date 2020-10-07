import $ from 'jquery';

class Pagination {
  #currentPage = 1;

  pages = 1;

  onChange = () => {};

  get currentPage() {
    return this.#currentPage;
  }

  set currentPage(page) {
    const pageNumber = Number(page);

    if (!pageNumber || pageNumber < 1 || pageNumber > this.pages) {
      this.#currentPage = 1;
      return;
    }

    this.#currentPage = page;
  }

  constructor(currentPage, pages, output) {
    this.output = output;
    this.#currentPage = currentPage;
    this.pages = pages;

    this.render();
  }

  async handlePageChange(page) {
    this.currentPage = page;
    const { pages } = await this.onChange(this.currentPage);
    this.pages = pages;

    this.render();
  }

  render() {
    $('.pagination').remove();

    this.output.insertAdjacentHTML('beforeend', `
      <div class="pagination">
        <button class="pagination__btn pagination__btn--prev">Prev</button>
        <div>
          <input class="pagination__input" type="text" value="${this.currentPage}">
          of
          <span>${this.pages}</span>
        </div>
        <button class="pagination__btn pagination__btn--next">Next</button>
      </div>
    `);

    $('.pagination__btn--next').on('click', () => this.handlePageChange(this.currentPage + 1));

    $('.pagination__btn--prev').on('click', () => this.handlePageChange(this.currentPage - 1));

    $('.pagination__input').on('blur', async (e) => this.handlePageChange(e.target.value));
  }
}

export default Pagination;
