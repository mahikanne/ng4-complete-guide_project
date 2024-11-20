import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ingredient } from '../shared/ingredient.model';
import { catchError, map, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private apiURL = environment.apiUrl;
  // private ingredients: Ingredient[] = [
  //   new Ingredient(0,'Apples', 5),
  //   new Ingredient(0,'Tomatoes', 10),
  // ];

  private ingredients: Ingredient[] = [];

  constructor(private http: HttpClient) {}

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredients() {
    //return this.ingredients.slice();

    return this.http.get<Ingredient[]>(this.apiURL + '/ShoppingList').pipe(
      map((ingredients) => {
        return ingredients.map((ingredient) => {
          return {
            ...ingredient,
          };
        });
      }),
      tap((ingredients) => {
        this.setIngredients(ingredients);
      }),

      catchError(this.handleError)
    );
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addingredient(ingredient: Ingredient) {
    // this.ingredients.push(ingredient);
    // this.ingredientsChanged.next(this.ingredients.slice());

    return this.http.post(this.apiURL+"/ShoppingList",ingredient).pipe(
        catchError(this.handleError)
    );

  }

  addIngredients(ingredients: Ingredient[]) {
    // for(let ingredient of ingredients){
    //   this.addingredient(ingredient);
    // }

    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(newIngredient: Ingredient) {
    // this.ingredients[index] = newIngredient;
    // this.ingredientsChanged.next(this.ingredients.slice());
    return this.http.put(this.apiURL+"/ShoppingList",newIngredient).pipe(
      catchError(this.handleError)
  );

  }
  deleteIngredient(index: number) {
    // this.ingredients.splice(index, 1);
    // this.ingredientsChanged.next(this.ingredients.slice());
  // return this.http.delete<void>(this.apiURL+"/ShoppingList",this.ingredients[index].ingredientId);
  return this.http.request<void>('DELETE',`${this.apiURL+"/ShoppingList/delete"}`,{body: this.ingredients[index]});


  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknow error occured!';

    if (errorRes.error instanceof ErrorEvent) {
      errorMessage=`Client-side error: ${errorRes.error.message}`;
      //errorMessage = 'An unknow error occured!';
    }
    else{
     errorMessage = `Server-side error: ${errorRes.status} - ${errorRes.message}`;
     //errorMessage = 'An unknow error occured!';
    }
    return throwError(()=>new Error(errorMessage));
  }
}
