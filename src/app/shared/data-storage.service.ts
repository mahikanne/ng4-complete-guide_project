import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://localhost:44384/api/Recipe', recipes)
      .subscribe((respose) => {
        console.log(respose);
      });
  }

  fetchRecipes() {
   return this.http
      .get<Recipe[]>('https://localhost:7268/api/Recipe')
      .pipe(map(recipes =>{
        return recipes.map(recipe => {
            return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes =>{
        this.recipeService.setRecipes(recipes);
      })
    )

  }
}
