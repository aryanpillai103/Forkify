import icons from 'url:../../img/icons.svg';

class RecipeView {
    #parentElement = document.querySelector('.recipe');
    #data;

    render(data){
        if(!data || !data.ingredients) {
            console.error('Invalid recipe data:', data);
            return;
        }
        this.#data = data;
        const markup = this.#generateMarkup();
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    
    #clear(){
        this.#parentElement.innerHTML = '';
    }

    renderSpinner = function () {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this.#parentElement.innerHTML = '';
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError(message = 'Something went wrong. Please try again!') {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    #formatQuantity(quantity) {
        if (!quantity) return '';
        
        // If it's already a whole number
        if (Number.isInteger(quantity)) return quantity.toString();
        
        // Handle decimal to fraction conversion
        const tolerance = 0.0001;
        let numerator = 1;
        let denominator = 1;
        let bestError = Math.abs(quantity - numerator/denominator);
        
        for (let denom = 1; denom <= 20; denom++) {
            for (let num = 1; num <= denom; num++) {
                const error = Math.abs(quantity - num/denom);
                if (error < bestError) {
                    bestError = error;
                    numerator = num;
                    denominator = denom;
                }
            }
        }
        
        if (bestError < tolerance) {
            if (numerator === denominator) return '1';
            return `${numerator}/${denominator}`;
        }
        
        return quantity.toString();
    }

    #generateMarkup() {
        // Safety check
        if (!this.#data || !this.#data.ingredients) {
            return '<p>No recipe data available</p>';
        }

        return `
            <figure class="recipe__fig">
                <img src="${this.#data.image}" alt="${this.#data.title}" class="recipe__img" />
                <h1 class="recipe__title">
                    <span>${this.#data.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime || 0}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${this.#data.servings || 0}</span>
                    <span class="recipe__info-text">servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn--tiny btn--decrease-servings">
                            <svg>
                                <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                        </button>
                        <button class="btn--tiny btn--increase-servings">
                            <svg>
                                <use href="${icons}#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="recipe__user-generated">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
                <button class="btn--round">
                    <svg class="">
                        <use href="${icons}#icon-bookmark-fill"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${this.#data.ingredients.map(ing => {
                        return `
                            <li class="recipe__ingredient">
                                <svg class="recipe__icon">
                                    <use href="${icons}#icon-check"></use>
                                </svg>
                                <div class="recipe__quantity">${this.#formatQuantity(ing.quantity)}</div>
                                <div class="recipe__description">
                                    <span class="recipe__unit">${ing.unit || ''}</span>
                                    ${ing.description || ''}
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>

            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${this.#data.publisher || 'Unknown'}</span>. Please check out
                    directions at their website.
                </p>
                <a
                    class="btn--small recipe__btn"
                    href="${this.#data.sourceUrl || '#'}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>
        `;
    }
}

export default new RecipeView();