import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AlertService } from '../shared/alert/alert.service';
import { RefreshService } from '../shared/refresh.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private igChangeSub!: Subscription;

  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  constructor(
    private slService: ShoppingListService,
    private alertService: AlertService,
    private refreshService: RefreshService
  ) {}
  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  ngOnInit(): void {
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
    //  this.igChangeSub= this.slService.getIngredients().subscribe((ingredients: Ingredient[])=>{
    //     this.ingredients = ingredients;
    //  });

    this.loadshoppinglist();

    this.refreshService.refresh$.subscribe(() => {
      this.loadshoppinglist();
    });
  }

  loadshoppinglist() {
    this.igChangeSub = this.slService.getIngredients().subscribe({
      next: (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      },
      error: (err) =>
        this.alertService.showErrorAlter(
          err.message,
          this.alertHost.viewContainerref
        ),
    });
  }

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
}
