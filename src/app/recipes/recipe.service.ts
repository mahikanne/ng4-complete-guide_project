import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable()
export class RecipeService {
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

  private recipes: Recipe[] = []

  constructor(private slService: ShoppingListService) {}

setRecipes(recipes: Recipe[]){
  this.recipes = recipes;
  this.recipeChanged.next(this.recipes.slice());
}


  getRecipes() {
    return this.recipes.slice();
  }

  getrecipe(index: number) {
    return this.recipes[index];
  }

  AddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newrecipe: Recipe) {
    this.recipes[index] = newrecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

   deleteRecipe(index:number){
      this.recipes.splice(index,1);
      this.recipeChanged.next(this.recipes.slice());
   }
}
