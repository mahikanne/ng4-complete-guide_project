import { RefreshService } from './../../shared/refresh.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from 'src/app/shared/placeholder/placeholder.directive';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;
  @ViewChild('f') slForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editedItemIndex!: number;
  editedItem!: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private alertService: AlertService,
    private router: Router,
    private refreshService: RefreshService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
          ingredientId:this.editedItem.ingredientId
        });
      }
    );
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex).subscribe(()=>{
        this.refreshService.notifyRefresh();
        this.router.navigate(['/shopping-list'])
    });
    this.onClear();
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    const newIngredient = new Ingredient(
      value.ingredientId,
      value.name,
      value.amount
    );
    if (this.editMode) {
      this.slService.updateIngredient(newIngredient).subscribe({
        next: () => {
          this.refreshService.notifyRefresh();
          this.router.navigate(['/shopping-list']);
        },
        error: (error) => {

        }
      });
    } else {
      newIngredient.ingredientId = 0;
      this.slService.addingredient(newIngredient).subscribe({
        next: () => {
          // this.alertService.showErrorAlter(
          //   'Ingredient saved successfully',
          //   this.alertHost.viewContainerref
          // );

          this.refreshService.notifyRefresh();

          this.router.navigate(['/shopping-list']);

        },
        error: (error) => {
          this.alertService.showErrorAlter(
            error.message,
            this.alertHost.viewContainerref
          );
        },
      });
    }
    this.editMode = false;
    form.reset();
  }
}
