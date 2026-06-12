import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeViews.js';

const controlRecipes = async function(){
    try{
        const id = window.location.hash.slice(1);
        console.log('Recipe ID:', id);
        
        if(!id) {
            recipeView.renderError('Please select a recipe');
            return;
        }

        // Show spinner while loading
        recipeView.renderSpinner();

        // Load the recipe
        await model.loadRecipe(id);
        
        // Check if recipe was loaded successfully
        if (!model.state.recipe || !model.state.recipe.ingredients) {
            throw new Error('Recipe data is invalid');
        }
        
        console.log('Loaded recipe:', model.state.recipe);
        
        // Render the recipe
        recipeView.render(model.state.recipe);
    }
    catch(err){
        console.error('Error in controlRecipes:', err);
        recipeView.renderError(err.message);
    }
};

// Listen for hash changes and page load
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));