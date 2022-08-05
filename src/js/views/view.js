import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || data?.length === 0) return this.renderError();

    this._data = data;
    const html = this._generateHTML();

    if (!render) return html;

    this._parentElement.innerText = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    // if (!data || data?.length === 0) return this.renderError();

    this._data = data;

    const newHTML = this._generateHTML();

    const newDOM = document.createRange().createContextualFragment(newHTML);
    const newEl = Array.from(newDOM.querySelectorAll('*'));
    const oldEl = Array.from(this._parentElement.querySelectorAll('*'));

    newEl.forEach((el, i) => {
      const currEl = oldEl[i];
      if (!el.isEqualNode(currEl)) {
        // oldEl[i] = el.cloneNode();
        Array.from(el.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );

        if (el.firstChild?.nodeValue.trim() !== '')
          currEl.textContent = el.textContent;
      }
    });
  }

  renderSpinner() {
    const html = `
          <div class="spinner">
            <svg>
              <use href="${icons.split('?')[0]}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._parentElement.innerText = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons.split('?')[0]}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._parentElement.innerText = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderSuccess(message = this._successMessage) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons.split('?')[0]}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._parentElement.innerText = '';
    this._;
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
