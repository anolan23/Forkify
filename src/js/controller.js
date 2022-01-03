import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipesView from './views/recipesView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

(function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //update recipes view to mark selected recipe
    recipesView.update(model.getSearchResultsPage());
    //update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //get recipe data
    await model.getRecipe(id);
    //render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
}

async function controlSearchResults() {
  try {
    recipesView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.getRecipes(query);
    console.log(model.state);
    recipesView.render(model.getSearchResultsPage());
    //Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
}

function controlPagination(goToPage) {
  //render new recipes and new buttons
  recipesView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //update recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  //add/remove bookmark
  const { recipe } = model.state;
  if (!recipe.bookmarked) model.addBookmark(recipe);
  else model.removeBookmark(recipe.id);
  //update recipeView
  recipeView.update(recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(recipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipe);
    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //change url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}
