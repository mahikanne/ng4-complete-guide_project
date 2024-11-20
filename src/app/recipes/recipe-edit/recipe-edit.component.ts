import { Subject } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { RefreshService } from 'src/app/shared/refresh.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private refreshService: RefreshService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initform();
    });

    this.refreshService.refresh$.subscribe(()=>{
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initform();
      });
    })

  }

  private initform() {
    let recipeId = 0;
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<FormGroup>([]);

    if (this.editMode) {
      const recipe = this.recipeService.getrecipe(this.id);
      recipeId = recipe.recipeId;
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          if (ingredient.ingredientId == null) {
            ingredient.ingredientId = 0;
          }
          recipeIngredients.push(
            new FormGroup({
              ingredientId: new FormControl(ingredient.ingredientId),
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      recipeId: new FormControl(recipeId),
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }


  onSubmit() {
    const recipe = new Recipe(
      this.recipeForm.value['recipeId'],
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );

    if (this.editMode) {
      this.recipeService.updateRecipe(recipe).subscribe((resData) => {
        // this.recipeService.getRecipes().subscribe((recipes: Recipe[]) => {

        // });
        this.refreshService.notifyRefresh();
        this.onCancel();
      });
    } else {
      this.recipeService.addRecipe(recipe).subscribe((resData) => {
        // this.recipeService.getRecipes().subscribe((recipes : Recipe[]) => {
        //   this.recipeService.recipeChanged.next(recipes.slice());
        // });
        this.refreshService.notifyRefresh();
        this.router.navigate(['/recipes']);
      });



    }


  }

  getControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        ingredientId: new FormControl(0),
        name: new FormControl(),
        amount: new FormControl(),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
