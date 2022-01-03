import icons from 'url:../../img/icons.svg';

class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @returns
   * @this {Object} View instance
   * @author Aaron Nolan
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();
    this._data = data;
    const html = this._generateHTML();
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    this._data = data;
    const newHTML = this._generateHTML();
    const newDOM = document.createRange().createContextualFragment(newHTML);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, index) => {
      const currentEl = currentElements[index];

      //update text
      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = newEl.textContent;
      }
      //update attributes
      if (!newEl.isEqualNode(currentEl)) {
        [...newEl.attributes].forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clearHTML() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
    `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const html = `
    <div class="error">
        <div>
            <svg>
            <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._message) {
    const html = `
    <div class="message">
        <div>
        <svg>
            <use href="${icons}#icon-smile"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}

export default View;
