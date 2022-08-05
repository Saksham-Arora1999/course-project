class searchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
  addHandler(handler) {
    this.#parentElement.addEventListener('submit', e => {
      //   console.log('hello');
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
