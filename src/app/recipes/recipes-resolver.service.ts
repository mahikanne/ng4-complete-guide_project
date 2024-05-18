import { Injectable } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable } from "rxjs";

@Injectable({providedIn:'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private dataStorageService:DataStorageService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.dataStorageService.fetchRecipes();
  }
}
