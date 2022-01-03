import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateHTML() {
    const { results, resultsPerPage, page } = this._data;
    const numPages = Math.ceil(results.length / resultsPerPage);
    //Page 1, and there are other pages
    if (page === 1 && numPages > 1) {
      return `
        <button data-goto="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    //Last Page
    if (page === numPages && numPages > 1) {
      return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>
      `;
    }
    //Other page
    if (page < numPages) {
      return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>
        <button data-goto="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    //Page 1, and no other other pages
    return '';
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
}

export default new PaginationView();
