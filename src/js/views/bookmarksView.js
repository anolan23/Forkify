import icons from 'url:../../img/icons.svg';
import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  _generateHTML() {
    const urlId = window.location.hash.slice(1);
    return this._data
      .map(recipe => {
        const { id, image, publisher, title, key } = recipe;
        return `
        <li class="preview">
            <a class="preview__link ${
              urlId === id ? 'preview__link--active' : ''
            }" href="#${id}">
              <figure class="preview__fig">
                <img src="${image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${title}</h4>
                <p class="preview__publisher">${publisher}</p>
                <div class="preview__user-generated ${key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
        </li>
      `;
      })
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
