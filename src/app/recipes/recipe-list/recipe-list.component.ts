import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];

  subscription! : Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
  //  this.subscription = this.recipeService.recipeChanged
  //   .subscribe((recipes: Recipe[]) => {
  //     this.recipes = recipes;
  //   });
    this.subscription =   this.recipeService.getRecipes().subscribe((recipes : Recipe[]) => {
      this.recipes = recipes;
    });

    //this.recipeService.recipeChanged.next(this.recipes);
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  receiveData(recipes: Recipe[]){
      this.recipes=recipes;
  }
}
