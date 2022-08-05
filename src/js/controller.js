import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipe() {
  try {
    const id = window.location.hash.toString().slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    ResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // Loading recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    ResultsView.renderSpinner();
    const query = searchView.getQuery();
    // console.log(query);
    if (!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);

    controlPagination();
  } catch (err) {
    recipeView.renderError();
  }
}
function controlPagination(page) {
  ResultsView.render(model.getSearchResultsPage(page));

  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // Update UI
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  recipeView.update(model.state.recipe);

  // Rendering bookmarks view
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  // console.log(newRecipe);
  // console.log(typeof newRecipe);
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //Display success message
    addRecipeView.renderSuccess();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change id in url
    console.log(model.state.recipe.id);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError('Wrong format for ingredients');
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandler(controlRecipe);
  searchView.addHandler(controlSearchResults);
  paginationView.addHandler(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
