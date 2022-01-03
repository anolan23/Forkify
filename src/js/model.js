import { API_URL, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 10,
  },
  bookmarks: [],
};

function createRecipeObj(data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function getRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObj(data);
    //flag recipe as bookmarked if it exists in bookmarks array
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRecipes(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const { resultsPerPage } = state.search;
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  const { servings, ingredients } = state.recipe;
  ingredients.forEach(ingredient => {
    const { quantity } = ingredient;
    ingredient.quantity = quantity * (newServings / servings);
  });
  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  //add barkmark
  state.bookmarks.push(recipe);
  //mark recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  saveBookmarks();
}

export function removeBookmark(id) {
  //delete barkmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //mark recipe as not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  saveBookmarks();
}

function saveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function loadBookmarks() {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
}

loadBookmarks();

function clearBookmarks() {
  localStorage.clear('bookmarks');
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
