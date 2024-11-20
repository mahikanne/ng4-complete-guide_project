import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject, exhaustMap, map, take, tap } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RecipeService {

  private apiURL =environment.apiUrl;
  recipeChanged = new Subject<Recipe[]>();

  // recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe',
  //     'This is simply a test',
  //     'https://www.jocooks.com/wp-content/uploads/2019/04/pork-schnitzel-1.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else you need to say',
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWbSx6i9N7YixLCS8pv88xDjwn_JhLRLhRg&s',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   ),
  // ];

  private recipes: Recipe[] = [];

  constructor(
    private http: HttpClient,
    private slService: ShoppingListService,
    private authService: AuthService
  ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    //return this.recipes.slice();



    return this.http.get<Recipe[]>(this.apiURL + '/api/Recipe').pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.setRecipes(recipes);
      })
    );
  }

  getrecipe(index: number) {
    return this.recipes[index];
  }

  AddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    //this.recipes.push(recipe);
    return this.http.post(this.apiURL + '/api/Recipe', recipe);
    //this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(updatedrecipe: Recipe) {
    return this.http.put(this.apiURL + '/api/Recipe', updatedrecipe);
    //this.recipes[index] = newrecipe;
    //this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
